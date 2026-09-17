import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/layout/navbar";
import Footer from "../components/footer/footer";

import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaCamera,
    FaSave,
    FaTimes,
    FaLock
} from "react-icons/fa";

import { updateProfile } from "../services/userService";

import "../components/profile/profile.css";


const API_URL = "http://localhost:5001";


const getImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("http")) {
        return image;
    }

    return `${API_URL}${image}`;
};


// Get saved user before initializing state
const getSavedUser = () => {
    try {
        const savedUser = localStorage.getItem("user");

        if (!savedUser) {
            return null;
        }

        return JSON.parse(savedUser);

    } catch (error) {
        console.error("Unable to read saved user:", error);
        return null;
    }
};


const Profile = () => {

    const navigate = useNavigate();

    const savedUser = getSavedUser();


    // ===============================
    // USER
    // ===============================

    const [user, setUser] = useState(savedUser);


    // ===============================
    // FORM
    // ===============================

    const [form, setForm] = useState({
        name: savedUser?.name || "",
        email: savedUser?.email || "",
        phone: savedUser?.phone || ""
    });


    // ===============================
    // IMAGE
    // ===============================

    const [profileImage, setProfileImage] = useState(null);

    const [preview, setPreview] = useState(
        savedUser?.profileImage
            ? getImageUrl(savedUser.profileImage)
            : ""
    );


    // ===============================
    // UI STATES
    // ===============================

    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState({
        type: "",
        text: ""
    });


    // ===============================
    // CHECK LOGIN
    // ===============================

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token || !savedUser) {
            navigate("/login");
        }

    }, [navigate, savedUser]);


    // ===============================
    // INPUT CHANGE
    // ===============================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));

    };


    // ===============================
    // IMAGE CHANGE
    // ===============================

    const handleImageChange = (e) => {

        const file = e.target.files[0];

        if (!file) return;


        if (!file.type.startsWith("image/")) {

            setMessage({
                type: "error",
                text: "Please select a valid image file."
            });

            return;
        }


        if (file.size > 10 * 1024 * 1024) {

            setMessage({
                type: "error",
                text: "Image size must be less than 10MB."
            });

            return;
        }


        setProfileImage(file);

        setPreview(URL.createObjectURL(file));

        setMessage({
            type: "",
            text: ""
        });

    };


    // ===============================
    // SAVE PROFILE
    // ===============================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setSaving(true);

        setMessage({
            type: "",
            text: ""
        });


        try {

            const formData = new FormData();

            formData.append("name", form.name);
            formData.append("email", form.email);
            formData.append("phone", form.phone);


            if (profileImage) {
                formData.append(
                    "profileImage",
                    profileImage
                );
            }


            const data = await updateProfile(formData);


            if (!data.success) {

                setMessage({
                    type: "error",
                    text: data.message || "Unable to update profile."
                });

                setSaving(false);

                return;
            }


            // Save updated user locally
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );


            setUser(data.user);

            setForm({
                name: data.user.name || "",
                email: data.user.email || "",
                phone: data.user.phone || ""
            });


            setProfileImage(null);


            if (data.user.profileImage) {

                setPreview(
                    getImageUrl(data.user.profileImage)
                );

            } else {

                setPreview("");

            }


            // Tell Navbar that user information changed
            window.dispatchEvent(
                new Event("userUpdated")
            );


            setMessage({
                type: "success",
                text: "Profile updated successfully!"
            });


        } catch (error) {

            console.error(error);

            setMessage({
                type: "error",
                text: "Something went wrong."
            });

        }


        setSaving(false);

    };


    // ===============================
    // CANCEL
    // ===============================

    const handleCancel = () => {

        if (!user) return;


        setForm({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || ""
        });


        setProfileImage(null);


        setPreview(
            user.profileImage
                ? getImageUrl(user.profileImage)
                : ""
        );


        setMessage({
            type: "",
            text: ""
        });

    };


    // ===============================
    // NO USER
    // ===============================

    if (!user) {
        return null;
    }


    return (
        <div className="profile-page">

            <Navbar />


            <main className="profile-container">


                {/* ================= HEADER ================= */}

                <div className="profile-header">

                    <div>

                        <p className="profile-eyebrow">
                            ACCOUNT
                        </p>

                        <h1>
                            My Profile
                        </h1>

                        <p>
                            Manage your personal information
                            and profile details.
                        </p>

                    </div>

                </div>


                <div className="profile-grid">


                    {/* ================= PROFILE CARD ================= */}

                    <section className="profile-card profile-photo-card">

                        <div className="profile-avatar-wrapper">

                            {preview ? (

                                <img
                                    src={preview}
                                    alt="Profile"
                                    className="profile-avatar"
                                />

                            ) : (

                                <div className="profile-avatar profile-avatar-placeholder">
                                    <FaUser />
                                </div>

                            )}


                            <label
                                htmlFor="profile-image"
                                className="profile-camera"
                            >
                                <FaCamera />
                            </label>


                            <input
                                id="profile-image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                hidden
                            />

                        </div>


                        <h2>
                            {user.name}
                        </h2>

                        <p>
                            {user.email}
                        </p>


                        <span className="profile-role">
                            {user.role || "student"}
                        </span>


                        <div className="profile-photo-note">

                            <FaCamera />

                            <span>
                                Click the camera icon to
                                change your profile picture.
                            </span>

                        </div>

                    </section>


                    {/* ================= INFORMATION CARD ================= */}

                    <section className="profile-card">

                        <div className="profile-card-header">

                            <div>

                                <h2>
                                    Personal Information
                                </h2>

                                <p>
                                    Update the information
                                    associated with your account.
                                </p>

                            </div>

                        </div>


                        {message.text && (

                            <div
                                className={
                                    message.type === "success"
                                        ? "profile-message success"
                                        : "profile-message error"
                                }
                            >
                                {message.text}
                            </div>

                        )}


                        <form onSubmit={handleSubmit}>


                            {/* NAME */}

                            <div className="profile-form-group">

                                <label>
                                    Full Name
                                </label>

                                <div className="profile-input-wrapper">

                                    <FaUser />

                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        required
                                    />

                                </div>

                            </div>


                            {/* EMAIL */}

                            <div className="profile-form-group">

                                <label>
                                    Email Address
                                </label>

                                <div className="profile-input-wrapper">

                                    <FaEnvelope />

                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        required
                                    />

                                </div>

                            </div>


                            {/* PHONE */}

                            <div className="profile-form-group">

                                <label>
                                    Phone Number
                                </label>

                                <div className="profile-input-wrapper">

                                    <FaPhone />

                                    <input
                                        type="tel"
                                        name="phone"
                                        autoComplete="off"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="Enter your phone number"
                                    />

                                </div>

                            </div>


                            {/* BUTTONS */}

                            <div className="profile-actions">

                                <button
                                    type="button"
                                    className="profile-cancel-btn"
                                    onClick={handleCancel}
                                >
                                    <FaTimes />
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="profile-save-btn"
                                    disabled={saving}
                                >

                                    <FaSave />

                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"
                                    }

                                </button>

                            </div>


                        </form>

                    </section>


                    {/* ================= SECURITY CARD ================= */}

                    <section className="profile-card profile-security-card">

                        <div className="profile-security-icon">
                            <FaLock />
                        </div>

                        <div>

                            <h3>
                                Keep your account secure
                            </h3>

                            <p>
                                Change your password regularly
                                to keep your FindIt account protected.
                            </p>

                        </div>


                        <button
                            onClick={() => navigate("/settings")}
                        >
                            Security Settings
                        </button>

                    </section>


                </div>

            </main>


            <Footer />

        </div>
    );
};


export default Profile;