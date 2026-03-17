require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./src/Utils/DBConnection");

const userRoutes = require("./src/Routes/UserRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Backend working 🚀");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});