const BASE_URL = `${import.meta.env.VITE_API_URL}/api/notifications`;

const getToken = () => {
    return localStorage.getItem("token");
};


// Get all notifications
export const getNotifications = async () => {
    try {
        const token = getToken();

        const response = await fetch(BASE_URL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return await response.json();

    } catch (error) {
        console.error(error);

        return {
            success: false,
            message: "Unable to fetch notifications",
            notifications: []
        };
    }
};


// Get unread notification count
export const getUnreadNotificationCount = async () => {
    try {
        const token = getToken();

        const response = await fetch(
            `${BASE_URL}/unread-count`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return await response.json();

    } catch (error) {
        console.error(error);

        return {
            success: false,
            count: 0
        };
    }
};


// Mark one notification as read
export const markNotificationAsRead = async (
    notificationId
) => {
    try {
        const token = getToken();

        const response = await fetch(
            `${BASE_URL}/${notificationId}/read`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return await response.json();

    } catch (error) {
        console.error(error);

        return {
            success: false,
            message: "Unable to mark notification as read"
        };
    }
};


// Mark ALL notifications as read
export const markAllNotificationsAsRead = async () => {
    try {
        const token = getToken();

        const response = await fetch(
            `${BASE_URL}/read-all`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return await response.json();

    } catch (error) {
        console.error(error);

        return {
            success: false,
            message: "Unable to mark notifications as read"
        };
    }
};


// Compatibility alias
// This supports code that imports the older name.
export const markAllNotificationsRead =
    markAllNotificationsAsRead;