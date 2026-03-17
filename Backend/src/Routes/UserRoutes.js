const router = require("express").Router();
const { registerUser } = require("../Controllers/UserController");

router.post("/register", registerUser);

module.exports = router;