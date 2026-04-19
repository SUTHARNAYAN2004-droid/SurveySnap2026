const router = require("express").Router();
const { registerUser, getAllUsers, deleteUser, uploadProfilePic, uploadProfilePicUrl } = require("../Controllers/UserController");
const { loginUser } = require("../Controllers/authControllers");
const upload = require("../Utils/upload"); // multer config for file upload

// Auth
router.post("/register", registerUser);   // Signup - name split into firstName/lastName
router.post("/login", loginUser);          // Login - returns profilePic in response

// Admin: user management
router.get("/", getAllUsers);              // Sab users fetch (password exclude)
router.delete("/:id", deleteUser);        // User delete (admin + self-delete dono use karte hain)

// Profile pic
router.put("/:id/profile-pic", upload.single("profilePic"), uploadProfilePic);  // File upload
router.put("/:id/profile-pic-url", uploadProfilePicUrl);                         // URL save (avatar)

module.exports = router;
