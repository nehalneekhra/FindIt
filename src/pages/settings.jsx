import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/layout/navbar";
import Footer from "../components/footer/footer";

import {
    FaLock,
    FaEye,
    FaEyeSlash,
    FaBell,
    FaUserEdit,
    FaSignOutAlt,
    FaShieldAlt
} from "react-icons/fa";

import {
    changePassword
} from "../services/userService";

import "../components/settings/settings.css";


const Settings = () => {

    const navigate = useNavigate();


    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });


    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);


    const [savingPassword, setSavingPassword] = useState(false);


    const [passwordMessage, setPasswordMessage] = useState({
        type: "",
        text: ""
    });


    const [notificationsEnabled, setNotificationsEnabled] =
        useState(
            localStorage.getItem("findit_notifications") !== "false"
        );


    // ===============================
    // PASSWORD INPUT
    // ===============================
    const handlePasswordChange = (e) => {

        const { name, value } = e.target;

        setPasswordForm(prev => ({
            ...prev,
            [name]: value
        }));

    };


    // ===============================
    // CHANGE PASSWORD
    // ===============================
    const handlePasswordSubmit = async (e) => {

        e.preventDefault();


        setPasswordMessage({
            type: "",
            text: ""
        });


        if (passwordForm.newPassword.length < 6) {

            setPasswordMessage({
                type: "error",
                text: "New password must be at least 6 characters."
            });

            return;
        }


        if (
            passwordForm.newPassword !==
            passwordForm.confirmPassword
        ) {

            setPasswordMessage({
                type: "error",
                text: "New passwords do not match."
            });

            return;
        }


        setSavingPassword(true);


        try {

            const data = await changePassword(
                passwordForm.currentPassword,
                passwordForm.newPassword
            );


            if (!data.success) {

                setPasswordMessage({
                    type: "error",
                    text: data.message || "Unable to change password."
                });

                setSavingPassword(false);

                return;
            }


            setPasswordMessage({
                type: "success",
                text: "Password changed successfully!"
            });


            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });


        } catch (error) {

            console.error(error);

            setPasswordMessage({
                type: "error",
                text: "Something went wrong."
            });

        }


        setSavingPassword(false);

    };


    // ===============================
    // NOTIFICATION TOGGLE
    // ===============================
    const handleNotificationToggle = () => {

        const newValue = !notificationsEnabled;

        setNotificationsEnabled(newValue);

        localStorage.setItem(
            "findit_notifications",
            String(newValue)
        );

    };


    // ===============================
    // LOGOUT
    // ===============================
    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.dispatchEvent(
            new Event("userUpdated")
        );

        navigate("/login");

    };


    return (
        <div className="settings-page">

            <Navbar />


            <main className="settings-container">


                {/* ================= HEADER ================= */}

                <div className="settings-header">

                    <div>

                        <p className="settings-eyebrow">
                            ACCOUNT
                        </p>

                        <h1>
                            Settings
                        </h1>

                        <p>
                            Manage your account, security
                            and notification preferences.
                        </p>

                    </div>

                </div>


                {/* ================= SECURITY ================= */}

                <section className="settings-card">

                    <div className="settings-card-header">

                        <div className="settings-card-icon">
                            <FaLock />
                        </div>

                        <div>

                            <h2>
                                Change Password
                            </h2>

                            <p>
                                Keep your account secure with
                                a strong password.
                            </p>

                        </div>

                    </div>


                    {passwordMessage.text && (

                        <div
                            className={
                                passwordMessage.type === "success"
                                    ? "settings-message success"
                                    : "settings-message error"
                            }
                        >
                            {passwordMessage.text}
                        </div>

                    )}


                    <form
                        className="settings-form"
                        onSubmit={handlePasswordSubmit}
                    >


                        {/* CURRENT PASSWORD */}

                        <div className="settings-form-group">

                            <label>
                                Current Password
                            </label>

                            <div className="settings-password-wrapper">

                                <FaLock />

                                <input
                                    type={
                                        showCurrent
                                            ? "text"
                                            : "password"
                                    }
                                    name="currentPassword"
                                    value={
                                        passwordForm.currentPassword
                                    }
                                    onChange={handlePasswordChange}
                                    placeholder="Enter current password"
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowCurrent(!showCurrent)
                                    }
                                >
                                    {showCurrent
                                        ? <FaEyeSlash />
                                        : <FaEye />
                                    }
                                </button>

                            </div>

                        </div>


                        {/* NEW PASSWORD */}

                        <div className="settings-form-group">

                            <label>
                                New Password
                            </label>

                            <div className="settings-password-wrapper">

                                <FaLock />

                                <input
                                    type={
                                        showNew
                                            ? "text"
                                            : "password"
                                    }
                                    name="newPassword"
                                    value={
                                        passwordForm.newPassword
                                    }
                                    onChange={handlePasswordChange}
                                    placeholder="Enter new password"
                                    minLength={6}
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowNew(!showNew)
                                    }
                                >
                                    {showNew
                                        ? <FaEyeSlash />
                                        : <FaEye />
                                    }
                                </button>

                            </div>

                            <span className="settings-help-text">
                                Password must contain at least 6 characters.
                            </span>

                        </div>


                        {/* CONFIRM PASSWORD */}

                        <div className="settings-form-group">

                            <label>
                                Confirm New Password
                            </label>

                            <div className="settings-password-wrapper">

                                <FaShieldAlt />

                                <input
                                    type={
                                        showConfirm
                                            ? "text"
                                            : "password"
                                    }
                                    name="confirmPassword"
                                    value={
                                        passwordForm.confirmPassword
                                    }
                                    onChange={handlePasswordChange}
                                    placeholder="Confirm new password"
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirm(!showConfirm)
                                    }
                                >
                                    {showConfirm
                                        ? <FaEyeSlash />
                                        : <FaEye />
                                    }
                                </button>

                            </div>

                        </div>


                        <button
                            type="submit"
                            className="settings-primary-btn"
                            disabled={savingPassword}
                        >

                            <FaLock />

                            {savingPassword
                                ? "Changing Password..."
                                : "Change Password"
                            }

                        </button>


                    </form>

                </section>


                {/* ================= NOTIFICATIONS ================= */}

                <section className="settings-card">

                    <div className="settings-row">

                        <div className="settings-row-left">

                            <div className="settings-card-icon">
                                <FaBell />
                            </div>

                            <div>

                                <h2>
                                    Notifications
                                </h2>

                                <p>
                                    Receive notifications about
                                    claims and item updates.
                                </p>

                            </div>

                        </div>


                        <button
                            type="button"
                            className={
                                notificationsEnabled
                                    ? "settings-toggle active"
                                    : "settings-toggle"
                            }
                            onClick={handleNotificationToggle}
                            aria-label="Toggle notifications"
                        >

                            <span />

                        </button>

                    </div>

                </section>


                {/* ================= PROFILE ================= */}

                <section className="settings-card">

                    <div className="settings-row">

                        <div className="settings-row-left">

                            <div className="settings-card-icon">
                                <FaUserEdit />
                            </div>

                            <div>

                                <h2>
                                    Profile Information
                                </h2>

                                <p>
                                    Update your name, email,
                                    phone number and profile picture.
                                </p>

                            </div>

                        </div>


                        <button
                            className="settings-secondary-btn"
                            onClick={() => navigate("/profile")}
                        >
                            Edit Profile
                        </button>

                    </div>

                </section>


                {/* ================= LOGOUT ================= */}

                <section className="settings-card settings-danger-card">

                    <div className="settings-row">

                        <div className="settings-row-left">

                            <div className="settings-danger-icon">
                                <FaSignOutAlt />
                            </div>

                            <div>

                                <h2>
                                    Log Out
                                </h2>

                                <p>
                                    Sign out of your FindIt account
                                    on this device.
                                </p>

                            </div>

                        </div>


                        <button
                            className="settings-logout-btn"
                            onClick={handleLogout}
                        >
                            <FaSignOutAlt />
                            Log Out
                        </button>

                    </div>

                </section>


            </main>


            <Footer />

        </div>
    );
};


export default Settings;