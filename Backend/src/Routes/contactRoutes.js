const express = require("express");
const router = express.Router();
const mailSend = require("../Utils/MailUtil");

// Contact form submit - admin ko email jaati hai
router.post("/", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Admin ko email bhejo user ke message ke saath
        await mailSend(
            process.env.EMAIL_USER,
            `New Contact Message from ${name} - SurveySnap`,
            `You have a new message from the Contact Us form:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n- SurveySnap`
        );

        res.status(200).json({ message: "Message sent successfully" });
    } catch (error) {
        console.error("Contact email error:", error.message);
        res.status(500).json({ message: "Failed to send message" });
    }
});

module.exports = router;
