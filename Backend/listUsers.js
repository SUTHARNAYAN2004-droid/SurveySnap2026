require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./src/Models/UserModel");

mongoose.connect(process.env.MONGO_URL).then(async () => {
  const users = await User.find({}, "email role");
  users.forEach(u => console.log(u.email, "-->", u.role));
  process.exit();
});
