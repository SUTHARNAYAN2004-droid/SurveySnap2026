const router = require("express").Router();
const { adminLogin, getAdminStats } = require("../Controllers/adminController");

router.post("/login", adminLogin);
router.get("/stats", getAdminStats);

module.exports = router;
