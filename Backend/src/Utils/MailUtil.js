const mailer = require("nodemailer");

const mailSend = async (to, subject, text) => {
    const transporter = mailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = { to, subject, text };
    const mailResponse = await transporter.sendMail(mailOptions);
    console.log("Email sent to:", to);
    return mailResponse;
};

module.exports = mailSend;
