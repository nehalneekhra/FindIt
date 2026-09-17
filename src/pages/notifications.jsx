import "../components/notifications/notifications.css";

import Navbar from "../components/layout/navbar";
import Footer from "../components/footer/footer";

import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    FaBell,
    FaCheck,
    FaCheckDouble,
    FaArrowLeft,
    FaInbox,
    FaClock
} from "react-icons/fa";

import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
} from "../services/notificationService";


export default function Notifications() {

    const navigate = useNavigate();


    const [notifications, setNotifications] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    /*
     * FETCH NOTIFICATIONS
     */
    useEffect(() => {

        const fetchNotifications =
            async () => {

                const token =
                    localStorage.getItem("token");


                if (!token) {

                    navigate("/login");

                    return;

                }


                try {

                    setLoading(true);

                    setError("");


                    const response =
                        await getNotifications();


                    if (
                        response.success
                    ) {

                        setNotifications(
                            response.notifications ||
                            []
                        );

                    } else {

                        setError(
                            response.message ||
                            "Unable to load notifications."
                        );

                    }

                } catch (error) {

                    console.error(error);

                    setError(
                        "Unable to load notifications."
                    );

                } finally {

                    setLoading(false);

                }

            };


        fetchNotifications();

    }, [navigate]);


    /*
     * MARK ONE READ
     */
    const handleNotificationClick =
        async (notification) => {

            if (!notification.read) {

                const response =
                    await markNotificationAsRead(
                        notification._id
                    );


                if (response.success) {

                    setNotifications(
                        prev =>
                            prev.map(item =>
                                item._id ===
                                notification._id
                                    ? {
                                        ...item,
                                        read: true
                                    }
                                    : item
                            )
                    );


                    /*
                     * Tell Navbar that the
                     * unread count changed.
                     */
                    window.dispatchEvent(
                        new Event(
                            "notificationsUpdated"
                        )
                    );

                }

            }


            /*
             * If notification has a
             * related claim, take user
             * to dashboard.
             */
            if (
                notification.relatedClaim
            ) {

                navigate("/dashboard");

                return;

            }


            /*
             * If notification has an
             * item but no claim,
             * open the item.
             */
            if (
                notification.relatedItem?._id
            ) {

                navigate(
                    `/item/${notification.relatedItem._id}`
                );

            }

        };


    /*
     * MARK ALL READ
     */
    const handleMarkAllRead =
        async () => {

            const response =
                await markAllNotificationsAsRead();


            if (
                response.success
            ) {

                setNotifications(
                    prev =>
                        prev.map(
                            notification => ({
                                ...notification,
                                read: true
                            })
                        )
                );


                /*
                 * Immediately tell Navbar
                 * to remove the unread badge.
                 */
                window.dispatchEvent(
                    new Event(
                        "notificationsUpdated"
                    )
                );

            }

        };


    /*
     * FORMAT DATE
     */
    const formatDate = (date) => {

        if (!date) {

            return "";

        }


        const notificationDate =
            new Date(date);


        if (
            Number.isNaN(
                notificationDate.getTime()
            )
        ) {

            return "";

        }


        return notificationDate.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );

    };


    /*
     * FORMAT TIME
     */
    const formatTime = (date) => {

        if (!date) {

            return "";

        }


        const notificationDate =
            new Date(date);


        if (
            Number.isNaN(
                notificationDate.getTime()
            )
        ) {

            return "";

        }


        return notificationDate.toLocaleTimeString(
            "en-IN",
            {
                hour: "numeric",
                minute: "2-digit"
            }
        );

    };


    /*
     * COUNT UNREAD NOTIFICATIONS
     */
    const unreadCount =
        notifications.filter(
            notification =>
                !notification.read
        ).length;


    return (

        <>

            <Navbar />


            <main className="notifications-page">

                <div className="notifications-container">


                    {/* HEADER */}

                    <div className="notifications-header">

                        <button

                            className="notifications-back"

                            onClick={() =>
                                navigate(-1)
                            }

                        >

                            <FaArrowLeft />

                            Back

                        </button>


                        <div className="notifications-title">

                            <div className="notifications-icon">

                                <FaBell />

                            </div>


                            <div>

                                <h1>
                                    Notifications
                                </h1>

                                <p>
                                    Stay updated about your FindIt activity.
                                </p>

                            </div>

                        </div>


                        {unreadCount > 0 && (

                            <button

                                className="mark-all-btn"

                                onClick={
                                    handleMarkAllRead
                                }

                            >

                                <FaCheckDouble />

                                Mark all as read

                            </button>

                        )}

                    </div>


                    {/* LOADING */}

                    {loading && (

                        <div className="notifications-empty">

                            <div className="notifications-spinner"></div>

                            <p>
                                Loading notifications...
                            </p>

                        </div>

                    )}


                    {/* ERROR */}

                    {!loading && error && (

                        <div className="notifications-empty">

                            <div className="notifications-empty-icon">

                                <FaBell />

                            </div>

                            <h3>
                                Something went wrong
                            </h3>

                            <p>
                                {error}
                            </p>

                        </div>

                    )}


                    {/* EMPTY */}

                    {!loading &&
                        !error &&
                        notifications.length === 0 && (

                            <div className="notifications-empty">

                                <div className="notifications-empty-icon">

                                    <FaInbox />

                                </div>

                                <h3>
                                    You're all caught up
                                </h3>

                                <p>
                                    You don't have any notifications yet.
                                </p>

                            </div>

                        )}


                    {/* NOTIFICATIONS */}

                    {!loading &&
                        !error &&
                        notifications.length > 0 && (

                            <div className="notifications-list">

                                {notifications.map(
                                    notification => (

                                        <div

                                            key={
                                                notification._id
                                            }

                                            className={`notification-card ${
                                                notification.read
                                                    ? "read"
                                                    : "unread"
                                            }`}

                                            onClick={() =>
                                                handleNotificationClick(
                                                    notification
                                                )
                                            }

                                        >


                                            {/* ICON */}

                                            <div

                                                className={`notification-card-icon ${
                                                    notification.type
                                                }`}

                                            >

                                                {
                                                    notification.type ===
                                                    "claim_accepted"

                                                        ? (
                                                            <FaCheck />
                                                        )

                                                        : notification.type ===
                                                          "claim_rejected"

                                                            ? (
                                                                <FaBell />
                                                            )

                                                            : (
                                                                <FaBell />
                                                            )
                                                }

                                            </div>


                                            {/* CONTENT */}

                                            <div className="notification-card-content">

                                                <div className="notification-card-top">

                                                    <h3>
                                                        {notification.title}
                                                    </h3>


                                                    {!notification.read && (

                                                        <span className="notification-new">

                                                            New

                                                        </span>

                                                    )}

                                                </div>


                                                <p>
                                                    {notification.message}
                                                </p>


                                                <div className="notification-time">

                                                    <FaClock />

                                                    {formatDate(
                                                        notification.createdAt
                                                    )}

                                                    <span>
                                                        •
                                                    </span>

                                                    {formatTime(
                                                        notification.createdAt
                                                    )}

                                                </div>

                                            </div>


                                            {/* READ INDICATOR */}

                                            {!notification.read && (

                                                <div className="notification-unread-dot"></div>

                                            )}

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                </div>

            </main>


            <Footer />

        </>

    );

}