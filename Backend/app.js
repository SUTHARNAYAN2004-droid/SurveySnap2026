require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./src/Utils/DBConnection");

const userRoutes = require("./src/Routes/UserRoutes");
const adminRoutes = require("./src/Routes/adminRoutes");
const surveyRoutes = require("./src/Routes/SurveyRoutes");
const contactRoutes = require("./src/Routes/contactRoutes");
const authRoutes = require("./src/Routes/authRoutes"); // Forgot password OTP routes

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Profile pic files serve karne ke liye

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/surveys", surveyRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend working 🚀");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
