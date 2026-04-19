require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./src/Models/UserModel");

mongoose.connect(process.env.MONGO_URL).then(async () => {
  const r = await User.updateOne(
    { email: "NayaanSuthar21@gmail.com" },
    { $set: { role: "admin" } }
  );
  console.log(r);
  process.exit();
});
