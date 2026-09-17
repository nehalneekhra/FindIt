const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead
} = require("../controllers/notificationController");


/*
 * Get all notifications
 */
router.get(
    "/",
    protect,
    getNotifications
);


/*
 * Get unread notification count
 */
router.get(
    "/unread-count",
    protect,
    getUnreadCount
);


/*
 * Mark all notifications as read
 *
 * IMPORTANT:
 * This must come before /:id
 */
router.put(
    "/read-all",
    protect,
    markAllAsRead
);


/*
 * Mark one notification as read
 */
router.put(
    "/:id/read",
    protect,
    markAsRead
);


module.exports = router;