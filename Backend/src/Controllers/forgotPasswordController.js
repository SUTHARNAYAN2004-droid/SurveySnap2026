const User = require("../Models/UserModel");
const bcrypt = require("bcryptjs");
const mailSend = require("../Utils/MailUtil");

// Step 1: Email se OTP bhejo
const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "No account found with this email" });

        // 6 digit OTP generate karo
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // OTP MongoDB mein save karo
        await User.updateOne({ email }, { resetOtp: otp, resetOtpExpiry: expiry });

        // Email bhejo
        await mailSend(
            email,
            "SurveySnap - Password Reset OTP",
            `Hello ${user.firstName},\n\nYour OTP for password reset is:\n\n${otp}\n\nThis OTP is valid for 10 minutes.\n\nIf you did not request this, ignore this email.\n\n- SurveySnap Team`
        );

        res.status(200).json({ message: "OTP sent to your email" });

    } catch (err) {
        console.error("Send OTP error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Step 2: OTP verify karo aur password reset karo
const verifyOtpAndReset = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Account not found" });

        // OTP check karo
        if (user.resetOtp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Expiry check karo
        if (new Date() > user.resetOtpExpiry) {
            return res.status(400).json({ message: "OTP has expired. Request a new one." });
        }

        // Naya password hash karo aur save karo
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.updateOne({ email }, {
            password: hashedPassword,
            resetOtp: "",           // OTP clear karo
            resetOtpExpiry: null
        });

        res.status(200).json({ message: "Password reset successfully" });

    } catch (err) {
        console.error("Reset password error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { sendOtp, verifyOtpAndReset };
