const Notification = require("../models/notification");


/*
 * GET MY NOTIFICATIONS
 */
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            recipient: req.user.id
        })
            .populate("relatedItem", "title")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: notifications.length,
            notifications
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch notifications"
        });
    }
};


/*
 * GET UNREAD NOTIFICATION COUNT
 */
const getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.countDocuments({
            recipient: req.user.id,
            read: false
        });

        res.status(200).json({
            success: true,
            count
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch unread count"
        });
    }
};


/*
 * MARK ONE NOTIFICATION AS READ
 */
const markAsRead = async (req, res) => {
    try {
        const notification =
            await Notification.findOne({
                _id: req.params.id,
                recipient: req.user.id
            });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        notification.read = true;

        await notification.save();

        res.status(200).json({
            success: true,
            message: "Notification marked as read"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Unable to update notification"
        });
    }
};


/*
 * MARK ALL NOTIFICATIONS AS READ
 */
const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            {
                recipient: req.user.id,
                read: false
            },
            {
                $set: {
                    read: true
                }
            }
        );

        res.status(200).json({
            success: true,
            message: "All notifications marked as read"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Unable to update notifications"
        });
    }
};


module.exports = {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead
};