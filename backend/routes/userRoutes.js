const express = require("express");
const router = express.Router();

const upload = require("../config/upload");
const protect = require("../middleware/authMiddleware");

const {
    updateProfile,
    changePassword
} = require("../controllers/userController");


// Update profile
router.put(
    "/profile",
    protect,
    upload.single("profileImage"),
    updateProfile
);


// Change password
router.put(
    "/password",
    protect,
    changePassword
);


module.exports = router;