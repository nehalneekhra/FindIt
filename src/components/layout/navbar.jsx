import "./navbar.css";

import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";

import { useState, useEffect, useRef } from "react";

import { motion, AnimatePresence } from "framer-motion";

import {
    FaSearch,
    FaBell,
    FaUserCircle,
    FaChevronDown,
    FaBars,
    FaTimes,
    FaSignOutAlt
} from "react-icons/fa";

import {
    getUnreadNotificationCount
} from "../../services/notificationService";


export default function Navbar() {

    const [sticky, setSticky] = useState(false);
    const [reportOpen, setReportOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const [user, setUser] = useState(() => {

        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            return null;
        }

        try {
            return JSON.parse(storedUser);
        } catch (error) {
            console.error("Unable to read user:", error);
            return null;
        }

    });

    const [unreadCount, setUnreadCount] = useState(0);

    const reportRef = useRef(null);
    const profileRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();
    const isProfilePage = location.pathname === "/profile";
    const isSettingsPage = location.pathname === "/settings";


    /*
     * Navbar scroll effect
     */
    useEffect(() => {

        const handleScroll = () => {
            setSticky(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };

    }, []);


    /*
     * Keep navbar user state synced
     */
    useEffect(() => {

        const handleStorageChange = () => {

            const storedUser =
                localStorage.getItem("user");

            if (!storedUser) {
                setUser(null);
                return;
            }

            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error(
                    "Unable to read user:",
                    error
                );

                setUser(null);
            }

        };

        window.addEventListener(
            "storage",
            handleStorageChange
        );

        return () => {
            window.removeEventListener(
                "storage",
                handleStorageChange
            );
        };

    }, []);


    /*
     * Fetch unread notifications
     */
    useEffect(() => {

        let interval;

        const fetchUnreadCount = async () => {

            const token =
                localStorage.getItem("token");

            if (!token) {
                setUnreadCount(0);
                return;
            }

            const response =
                await getUnreadNotificationCount();

            if (response.success) {
                setUnreadCount(
                    response.count || 0
                );
            }

        };


        fetchUnreadCount();


        /*
         * Check periodically so the red badge
         * updates when a new claim arrives.
         */
        interval = setInterval(
            fetchUnreadCount,
            10000
        );


        return () => {
            clearInterval(interval);
        };

    }, []);


    /*
     * Close dropdowns when clicking outside
     */
    useEffect(() => {

        const handleClick = (e) => {

            if (
                reportRef.current &&
                !reportRef.current.contains(e.target)
            ) {
                setReportOpen(false);
            }

            if (
                profileRef.current &&
                !profileRef.current.contains(e.target)
            ) {
                setProfileOpen(false);
            }

        };

        document.addEventListener(
            "mousedown",
            handleClick
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClick
            );
        };

    }, []);


    /*
     * Logout
     */
    const handleLogout = () => {

        localStorage.removeItem("user");
        localStorage.removeItem("token");

        setUser(null);
        setUnreadCount(0);

        setProfileOpen(false);

        navigate("/");

    };


    return (

        <nav
    className={`navbar navbar-expand-lg custom-navbar ${
        sticky ? "navbar-scrolled" : ""
    } ${
        isProfilePage || isSettingsPage ? "profile-navbar" : ""
    }`}
>

            <div className="container-fluid px-5">


                {/* LOGO */}

                <Link

                    className="navbar-brand d-flex align-items-center"

                    to="/"

                >

                    <motion.div

                        initial={{
                            rotate: -35,
                            scale: 0
                        }}

                        animate={{
                            rotate: 0,
                            scale: sticky ? .9 : 1
                        }}

                        transition={{
                            duration: .8,
                            type: "spring",
                            stiffness: 180
                        }}

                    >

                        <FaSearch className="logo-icon"/>

                    </motion.div>


                    <motion.span

                        initial={{
                            x: -30,
                            opacity: 0
                        }}

                        animate={{
                            x: 0,
                            opacity: 1,
                            scale: sticky ? .94 : 1
                        }}

                        transition={{
                            delay: .3
                        }}

                        className="logo-find"

                    >

                        Find

                    </motion.span>


                    <motion.span

                        initial={{
                            x: 30,
                            opacity: 0
                        }}

                        animate={{
                            x: 0,
                            opacity: 1,
                            scale: sticky ? .94 : 1
                        }}

                        transition={{
                            delay: .45
                        }}

                        className="logo-it"

                    >

                        It

                    </motion.span>

                </Link>


                {/* MOBILE MENU BUTTON */}

                <button

                    className="navbar-toggler"

                    onClick={() =>
                        setMobileOpen(!mobileOpen)
                    }

                >

                    {

                        mobileOpen

                            ? <FaTimes/>

                            : <FaBars/>

                    }

                </button>


                <div

                    className={`collapse navbar-collapse ${
                        mobileOpen
                            ? "show"
                            : ""
                    }`}

                >

                    <ul className="navbar-nav ms-auto align-items-center">


                        {/* HOME */}

                        <li className="nav-item">

                            <NavLink

                                to="/"

                                className="nav-link"

                                onClick={() =>
                                    setMobileOpen(false)
                                }

                            >

                                Home

                            </NavLink>

                        </li>


                        {/* BROWSE */}

                        <li className="nav-item">

                            <NavLink

                                to="/browse"

                                className="nav-link"

                                onClick={() =>
                                    setMobileOpen(false)
                                }

                            >

                                Browse

                            </NavLink>

                        </li>


                        {/* REPORT */}

                        <li

                            className="nav-item position-relative"

                            ref={reportRef}

                        >

                            <button

                                className="report-btn"

                                onClick={() => {

                                    setReportOpen(
                                        !reportOpen
                                    );

                                    setProfileOpen(false);

                                }}

                            >

                                Report


                                <FaChevronDown

                                    className={`arrow ${
                                        reportOpen
                                            ? "rotate"
                                            : ""
                                    }`}

                                />

                            </button>


                            <AnimatePresence>

                                {

                                    reportOpen && (

                                        <motion.div

                                            className="custom-dropdown"

                                            initial={{
                                                opacity: 0,
                                                y: 12,
                                                scale: .96
                                            }}

                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                scale: 1
                                            }}

                                            exit={{
                                                opacity: 0,
                                                y: 12,
                                                scale: .96
                                            }}

                                            transition={{
                                                duration: .22
                                            }}

                                        >

                                            <div className="dropdown-links">


                                                <Link

                                                    to="/report-lost"

                                                    onClick={() =>
                                                        setReportOpen(false)
                                                    }

                                                >

                                                    Report Lost

                                                </Link>


                                                <Link

                                                    to="/report-found"

                                                    onClick={() =>
                                                        setReportOpen(false)
                                                    }

                                                >

                                                    Report Found

                                                </Link>


                                            </div>

                                        </motion.div>

                                    )

                                }

                            </AnimatePresence>

                        </li>


                        {/* LOGIN */}

                        {

                            !user && (

                                <li className="nav-item ms-3">

                                    <NavLink

                                        to="/login"

                                        className="login-nav-btn"

                                    >

                                        Login

                                    </NavLink>

                                </li>

                            )

                        }


                        {/* RIGHT SIDE ICONS */}

                        <div className="navbar-actions">


                            {/* SEARCH */}

                            <Link

                                to="/search"

                                className="icon-btn"

                            >

                                <FaSearch/>

                            </Link>


                            {/* NOTIFICATIONS */}

                            <li className="nav-item">

                                <Link

                                    to="/notifications"

                                    className="icon-btn notification-btn"

                                    onClick={() =>
                                        setMobileOpen(false)
                                    }

                                >

                                    <FaBell/>


                                    {/* REAL UNREAD BADGE */}

                                    {unreadCount > 0 && (

                                        <span className="notification-dot">

                                            {unreadCount > 99
                                                ? "99+"
                                                : unreadCount}

                                        </span>

                                    )}

                                </Link>

                            </li>


                            {/* PROFILE */}

                            <li

                                className="nav-item position-relative"

                                ref={profileRef}

                            >

                                <button

                                    className="icon-btn"

                                    onClick={() => {

                                        setProfileOpen(
                                            !profileOpen
                                        );

                                        setReportOpen(false);

                                    }}

                                >

                                    <FaUserCircle/>

                                </button>


                                <AnimatePresence>

                                    {

                                        profileOpen && (

                                            <motion.div

                                                className="profile-dropdown"

                                                initial={{
                                                    opacity: 0,
                                                    y: 12,
                                                    scale: .96
                                                }}

                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                    scale: 1
                                                }}

                                                exit={{
                                                    opacity: 0,
                                                    y: 12,
                                                    scale: .96
                                                }}

                                                transition={{
                                                    duration: .22
                                                }}

                                            >

                                                {

                                                    user ? (

                                                        <>

                                                            <div className="profile-header">

                                                                <h4>

                                                                    {user.name || "User"}

                                                                </h4>

                                                                <p>

                                                                    {user.email || ""}

                                                                </p>

                                                            </div>


                                                            <div className="dropdown-links">

                                                                <Link

                                                                    to="/profile"

                                                                    onClick={() =>
                                                                        setProfileOpen(false)
                                                                    }

                                                                >

                                                                    Profile

                                                                </Link>


                                                                <Link

                                                                    to="/dashboard"

                                                                    onClick={() =>
                                                                        setProfileOpen(false)
                                                                    }

                                                                >

                                                                    Dashboard

                                                                </Link>


                                                                <button

                                                                    onClick={
                                                                        handleLogout
                                                                    }

                                                                >

                                                                    <FaSignOutAlt />

                                                                    Logout

                                                                </button>

                                                            </div>

                                                        </>

                                                    ) : (

                                                        <>

                                                            <div className="profile-header">

                                                                <h4>

                                                                    Guest User

                                                                </h4>

                                                                <p>

                                                                    Sign in to access your dashboard.

                                                                </p>

                                                            </div>


                                                            <div className="dropdown-links">

                                                                <Link

                                                                    to="/login"

                                                                    onClick={() =>
                                                                        setProfileOpen(false)
                                                                    }

                                                                >

                                                                    Login

                                                                </Link>


                                                                <Link

                                                                    to="/signup"

                                                                    onClick={() =>
                                                                        setProfileOpen(false)
                                                                    }

                                                                >

                                                                    Create Account

                                                                </Link>

                                                            </div>

                                                        </>

                                                    )

                                                }

                                            </motion.div>

                                        )

                                    }

                                </AnimatePresence>

                            </li>

                        </div>

                    </ul>

                </div>

            </div>

        </nav>

    );

}