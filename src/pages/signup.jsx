import {
    signupUser,
    googleLoginUser
} from "../services/authService";

import {
    signInWithPopup,
    GoogleAuthProvider
} from "firebase/auth";

import { auth } from "../firebase";
import "../components/signup/signup.css";

import Navbar from "../components/layout/navbar";
import Footer from "../components/footer/footer";

import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaCheckCircle,
} from "react-icons/fa";

export default function Signup() {

  const navigate = useNavigate();


  const handleGoogleSignup = async () => {
    try {
        const provider = new GoogleAuthProvider();

        const result = await signInWithPopup(auth, provider);

        const idToken = await result.user.getIdToken();

        const response = await googleLoginUser(idToken);

        if (response.success) {
            localStorage.setItem("token", response.token);

            localStorage.setItem(
                "user",
                JSON.stringify(response.user)
            );

            alert("Google Signup Successful!");

            navigate("/");
        } else {
            alert(response.message);
        }

    } catch (error) {
        console.error("Google Signup Error:", error);

        alert("Google Signup Failed. Please try again.");
    }
};

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    studentid: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {

  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  if (!formData.agree) {
    alert("Please accept the Terms & Conditions.");
    return;
  }

  const response = await signupUser({
    name: formData.fullname,
    email: formData.email,
    password: formData.password,
    phone: formData.phone,
  });

  if (response.success) {

    alert("Account Created Successfully!");

    navigate("/login");

  } else {

    alert(response.message);

  }

};

  return (
    <>
      <Navbar />

      <section className="signup-page">
        <div className="signup-container">

          <motion.div
            className="signup-wrapper"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .6 }}
          >

            {/* LEFT */}

            <div className="signup-left">

              <span className="signup-tag">
                Join FindIt 🚀
              </span>

              <h1>Create Your Account</h1>

              <p>
                Become a part of your campus community.
                Report lost belongings, help others recover
                their valuables, and receive instant updates.
              </p>

              <div className="signup-features">

                <div>
                  <FaCheckCircle />
                  <span>Report Lost Items</span>
                </div>

                <div>
                  <FaCheckCircle />
                  <span>Report Found Items</span>
                </div>

                <div>
                  <FaCheckCircle />
                  <span>Claim Matching Items</span>
                </div>

                <div>
                  <FaCheckCircle />
                  <span>Real-time Notifications</span>
                </div>

              </div>

            </div>

            {/* RIGHT */}

            <div className="signup-right">

              <h2>Create Account</h2>

              <p>
                Start your FindIt journey today.
              </p>

              <form onSubmit={handleSubmit}>

                <div className="input-group">

                  <label>
                    <FaUser />
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullname"
                    placeholder="Enter your full name"
                    value={formData.fullname}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="input-group">

                  <label>
                    <FaEnvelope />
                    College Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter college email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="two-fields">

                  <div className="input-group">

                    <label>
                      <FaIdCard />
                      Student ID
                    </label>

                    <input
                      type="text"
                      name="studentid"
                      placeholder="Student ID"
                      value={formData.studentid}
                      onChange={handleChange}
                    />

                  </div>

                  <div className="input-group">

                    <label>
                      <FaPhone />
                      Phone Number
                    </label>

                    <input
                      type="text"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                    />

                  </div>

                </div>

                <div className="input-group">

                  <label>
                    <FaLock />
                    Password
                  </label>

                  <div className="password-box">

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />

                    <button
                      type="button"
                      className="eye-btn"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>

                  </div>

                </div>

                <div className="input-group">

                  <label>
                    <FaLock />
                    Confirm Password
                  </label>

                  <div className="password-box">

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />

                    <button
                      type="button"
                      className="eye-btn"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}
                    </button>

                  </div>

                </div>

                <label className="terms-check">

                  <input
                    type="checkbox"
                    name="agree"
                    checked={formData.agree}
                    onChange={handleChange}
                  />

                  I agree to the Terms & Conditions

                </label>

                <button
                  type="submit"
                  className="signup-btn"
                >
                  Create Account
                </button>

                <div className="divider">
                  <span>OR</span>
                </div>

                <button
                  type="button"
                  className="google-btn"
                  onClick={handleGoogleSignup}
                >
                  <FaGoogle />
                  Continue with Google
                </button>

                <div className="login-link">

                  Already have an account?

                  <Link to="/login">
                    Login
                  </Link>

                </div>

              </form>

            </div>

          </motion.div>

        </div>
      </section>

      <Footer />
    </>
  );
}