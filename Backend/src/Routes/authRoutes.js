const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../Models/UserModel");
const mailSend = require("../Utils/MailUtil");

// Step 1: Email daalo - OTP generate karke bhejo
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Email not found" });

        // 6 digit OTP generate karo
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // OTP MongoDB mein save karo
        await User.updateOne({ email }, { resetOtp: otp, resetOtpExpiry: expiry });

        // Email bhejo
        await mailSend(email, "SurveySnap - Password Reset OTP",
            `Hello,\n\nYour OTP for password reset is:\n\n${otp}\n\nThis OTP is valid for 10 minutes.\n\nClick the link below to reset your password:\n${process.env.FRONTEND_URL}/forgot-password\n\nIf you did not request this, ignore this email.\n\n- SurveySnap Team`
        );

        res.status(200).json({ message: "OTP sent to your email", otp });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Step 2: OTP verify karo
router.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Email not found" });

        if (user.resetOtp !== otp) return res.status(400).json({ message: "Invalid OTP" });
        if (new Date() > user.resetOtpExpiry) return res.status(400).json({ message: "OTP expired" });

        res.status(200).json({ message: "OTP verified" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Step 3: Naya password set karo
router.post("/reset-password", async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Email not found" });

        if (user.resetOtp !== otp) return res.status(400).json({ message: "Invalid OTP" });
        if (new Date() > user.resetOtpExpiry) return res.status(400).json({ message: "OTP expired" });

        // Naya password purane jaisa nahi hona chahiye
        const isSameAsOld = await bcrypt.compare(newPassword, user.password);
        if (isSameAsOld) return res.status(400).json({ message: "New password cannot be same as old password" });

        const hashed = await bcrypt.hash(newPassword, 10);
        await User.updateOne({ email }, { password: hashed, resetOtp: "", resetOtpExpiry: null });

        res.status(200).json({ message: "Password reset successful" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
