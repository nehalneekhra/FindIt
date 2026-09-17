const User = require("../models/user");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const getSafeUser = (user) => {
    const userObject = user.toObject();

    delete userObject.password;

    return userObject;
};


// ===============================
// UPDATE PROFILE
// ===============================
const updateProfile = async (req, res) => {
    try {
        const { name, email, phone } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Name is required"
            });
        }

        if (!email || !validator.isEmail(email.trim())) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Check if another account already uses this email
        if (normalizedEmail !== user.email) {
            const emailUser = await User.findOne({
                email: normalizedEmail,
                _id: { $ne: user._id }
            });

            if (emailUser) {
                return res.status(400).json({
                    success: false,
                    message: "An account with this email already exists"
                });
            }
        }

        user.name = name.trim();
        user.email = normalizedEmail;
        user.phone = phone ? phone.trim() : "";

        // Update profile image if uploaded
        if (req.file) {
            user.profileImage = `/uploads/${req.file.filename}`;
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: getSafeUser(user)
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Unable to update profile"
        });
    }
};


// ===============================
// CHANGE PASSWORD
// ===============================
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current and new password are required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters"
            });
        }

        if (currentPassword === newPassword) {
            return res.status(400).json({
                success: false,
                message: "New password must be different from your current password"
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const passwordMatches = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!passwordMatches) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Unable to change password"
        });
    }
};


module.exports = {
    updateProfile,
    changePassword
};