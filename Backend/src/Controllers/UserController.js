const User = require("../Models/UserModel");
const bcrypt = require("bcryptjs");
const mailSend = require("../Utils/MailUtil");

// Signup - name ko firstName/lastName mein split karta hai
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [firstName, ...rest] = name.trim().split(" ");
    const lastName = rest.join(" ") || "";

    const newUser = await User.create({ firstName, lastName, email, password: hashedPassword });

    // Welcome email bhejo
    try {
      await mailSend(
        email,
        "Welcome to SurveySnap! 🎉",
        `Hi ${firstName},\n\nThank you for joining SurveySnap!\n\nYou can now create surveys, share them, and analyze responses in real-time.\n\nGet started: http://10.169.7.128:5173/login\n\n- SurveySnap Team`
      );
    } catch (mailErr) {
      console.error("Welcome email failed:", mailErr.message);
    }

    res.status(201).json({ message: "Signup success", data: newUser });

  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin: sab users fetch karo (password field exclude)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin ya user khud apna account delete kar sakta hai
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Signup ke baad profile pic upload (multer se file save hoti hai /uploads mein)
const uploadProfilePic = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const profilePic = `http://10.169.7.128:5000/uploads/${req.file.filename}`;
    await User.findByIdAndUpdate(id, { profilePic });

    res.status(200).json({ message: "Profile pic updated", profilePic });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Avatar URL directly save karna (file upload nahi, sirf URL store)
const uploadProfilePicUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { profilePic } = req.body;
    await User.findByIdAndUpdate(id, { profilePic });
    res.status(200).json({ message: "Profile pic updated", profilePic });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, getAllUsers, deleteUser, uploadProfilePic, uploadProfilePicUrl };
