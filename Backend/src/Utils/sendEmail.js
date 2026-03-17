import nodemailer from "nodemailer";

export const sendLoginEmail = async (userEmail) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "yourgmail@gmail.com",
      pass: "your_app_password"
    }
  });

  try {

    const info = await transporter.sendMail({
      from: "yourgmail@gmail.com",
      to: userEmail,
      subject: "Welcome to SurveySnap",
      text: "Thank you for visiting SurveySnap website."
    });

    console.log("Email sent:", info.response);

  } catch (error) {

    console.log("Email error:", error);

  }

};