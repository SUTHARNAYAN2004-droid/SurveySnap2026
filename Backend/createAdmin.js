require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/Models/UserModel");

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URL);

  const existing = await User.findOne({ email: "admin@surveysnap.com" });
  if (existing) {
    console.log("✅ Admin already exists");
    process.exit();
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);

  await User.create({
    firstName: "Admin",
    lastName: "User",
    email: "admin@surveysnap.com",
    password: hashedPassword,
    role: "admin"
  });

  console.log("✅ Admin created successfully");
  console.log("   Email: admin@surveysnap.com");
  console.log("   Password: admin123");
  process.exit();
};

createAdmin();
