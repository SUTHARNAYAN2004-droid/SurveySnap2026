const User = require("../Models/UserModel");
const Survey = require("../Models/Survey");
const Response = require("../Models/Response");
const bcrypt = require("bcryptjs");

// Admin login - role "admin" check karta hai, normal user ko 403 deta hai
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Account not found" });

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    return res.status(200).json({
      message: "Admin Login Successful",
      user: { id: user._id, name: `${user.firstName} ${user.lastName}`.trim(), email: user.email, role: user.role }
    });

  } catch (error) {
    console.error("Admin login error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Admin dashboard stats - real time data MongoDB se
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalSurveys = await Survey.countDocuments();
    const totalResponses = await Response.countDocuments();

    return res.status(200).json({ totalUsers, totalSurveys, totalResponses });
  } catch (error) {
    console.error("Stats error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { adminLogin, getAdminStats };
