import User from "../Models/UserModel.js";
import { sendLoginEmail } from "../Utils/sendEmail.js";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for:", email);

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Account not found"
      });
    }

    // 2. Validate password
    if (user.password !== password) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

    // 3. Send Email (with error handling)
    try {
        await sendLoginEmail(user.email);
        console.log("Email sent successfully to:", user.email);
    } catch (emailErr) {
        console.error("Email failed to send:", emailErr.message);
        // Hum yahan return nahi kar rahe taaki login toh successful ho jaye 
        // bhale hi email fail ho gaya ho.
    }

    // 4. Send success response
    return res.status(200).json({
      message: "Login Successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Login Controller Error:", error);
    return res.status(500).json({
      message: "Server Error"
    });
  }
};