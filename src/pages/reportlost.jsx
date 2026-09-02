import "../components/reportlost/reportlost.css";
import { reportLostItem } from "../services/lostService";
import Navbar from "../components/layout/navbar";
import Footer from "../components/footer/footer";

import { motion } from "framer-motion";
import { useState } from "react";

import {
  FaCloudUploadAlt,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTag,
  FaGift,
  FaPhoneAlt,
  FaEnvelope
} from "react-icons/fa";

export default function ReportLost() {

  const [image, setImage] = useState(null);

  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({

    title: "",

    category: "",

    location: "",

    date: "",

    description: "",

    reward: "",

    phone: "",

    email: ""

  });

  const handleImage = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setImage(file);

    setPreview(URL.createObjectURL(file));

  };

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("Please login first.");
        return;
    }

    const data = new FormData();

    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("location", formData.location);
    data.append("dateLost", formData.date);
    data.append("reward", formData.reward);
    data.append("phone", formData.phone);
    data.append("email", formData.email);

    if (image) {
        data.append("image", image);
    }

    const response = await reportLostItem(data);

    if (response.success) {

        alert("Lost Item Reported Successfully!");

        setFormData({
            title: "",
            category: "",
            location: "",
            date: "",
            description: "",
            reward: "",
            phone: "",
            email: ""
        });

        setImage(null);
        setPreview("");

    } else {

        alert(response.message);

    }

};

  return (

    <>

      <Navbar />

      <section className="report-page">

        <div className="container">

          <motion.div

            className="report-header"

            initial={{ opacity: 0, y: 40 }}

            animate={{ opacity: 1, y: 0 }}

            transition={{ duration: .6 }}

          >

            <span className="report-tag">

              Lost & Found Portal

            </span>

            <h1>

              Report Lost Item

            </h1>

            <p>

              Fill in the details below so others can help
              you recover your belongings.

            </p>

          </motion.div>

          <motion.form

            className="report-form"

            initial={{ opacity: 0, y: 40 }}

            animate={{ opacity: 1, y: 0 }}

            transition={{ delay: .2 }}

            onSubmit={handleSubmit}

          >

            <div className="upload-section">

              <label htmlFor="imageUpload">

                {

                  preview ?

                  (

                    <img

                      src={preview}

                      alt="preview"

                      className="preview-image"

                    />

                  )

                  :

                  (

                    <>

                      <FaCloudUploadAlt className="upload-icon" />

                      <h3>

                        Upload Item Image

                      </h3>

                      <p>

                        Drag & Drop

                        <br />

                        or click to browse

                      </p>

                    </>

                  )

                }

              </label>

              <input

                id="imageUpload"

                type="file"

                accept="image/*"

                onChange={handleImage}

                hidden

              />

            </div>

            <div className="form-grid">

              <div className="input-group">

                <label>

                  Item Name

                </label>

                <input

                  type="text"

                  name="title"

                  placeholder="Enter item name"

                  value={formData.title}

                  onChange={handleChange}

                  required

                />

              </div>

              <div className="input-group">

                <label>

                  <FaTag />

                  Category

                </label>

                <select

                  name="category"

                  value={formData.category}

                  onChange={handleChange}

                  required

                >

                  <option value="">

                    Select Category

                  </option>

                  <option>

                    Electronics

                  </option>

                  <option>

                    Wallet

                  </option>

                  <option>

                    Bag

                  </option>

                  <option>

                    Books

                  </option>

                  <option>

                    Keys

                  </option>

                  <option>

                    Accessories

                  </option>

                </select>

              </div>

              <div className="input-group">

                <label>

                  <FaMapMarkerAlt />

                  Location

                </label>

                <input

                  type="text"

                  name="location"

                  placeholder="Where did you lose it?"

                  value={formData.location}

                  onChange={handleChange}

                  required

                />

              </div>

              <div className="input-group">

                <label>

                  <FaCalendarAlt />

                  Date Lost

                </label>

                <input

                  type="date"

                  name="date"

                  value={formData.date}

                  onChange={handleChange}

                  required

                />

              </div>
                            <div className="input-group full-width">

                <label>

                  Description

                </label>

                <textarea

                  name="description"

                  rows="6"

                  maxLength="500"

                  placeholder="Describe your lost item in detail. Mention color, brand, unique marks, contents, etc."

                  value={formData.description}

                  onChange={handleChange}

                  required

                />

                <span className="character-count">

                  {formData.description.length}/500

                </span>

              </div>

              <div className="input-group">

                <label>

                  <FaGift />

                  Reward (Optional)

                </label>

                <input

                  type="text"

                  name="reward"

                  placeholder="e.g. ₹500"

                  value={formData.reward}

                  onChange={handleChange}

                />

              </div>

              <div className="input-group">

                <label>

                  <FaPhoneAlt />

                  Contact Number

                </label>

                <input

                  type="tel"

                  name="phone"

                  placeholder="Enter your phone number"

                  value={formData.phone}

                  onChange={handleChange}

                  required

                />

              </div>

              <div className="input-group full-width">

                <label>

                  <FaEnvelope />

                  Email Address

                </label>

                <input

                  type="email"

                  name="email"

                  placeholder="Enter your email"

                  value={formData.email}

                  onChange={handleChange}

                  required

                />

              </div>

            </div>

            <div className="agreement">

              <input

                type="checkbox"

                id="confirm"

                required

              />

              <label htmlFor="confirm">

                I confirm that all the information provided is true
                and accurate to the best of my knowledge.

              </label>

            </div>

            <button

              type="submit"

              className="submit-btn"

            >

              Submit Report

            </button>

          </motion.form>

        </div>

      </section>

      <Footer />

    </>

  );

}