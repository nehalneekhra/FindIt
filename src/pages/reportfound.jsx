import "../components/reportfound/reportfound.css";

import Navbar from "../components/layout/navbar";
import Footer from "../components/footer/footer";

import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { reportFoundItem } from "../services/foundService";

import {
  FaCloudUploadAlt,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTag,
  FaPhoneAlt,
  FaEnvelope,
  FaUser
} from "react-icons/fa";

export default function ReportFound() {

  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({

    title: "",
    category: "",
    location: "",
    date: "",
    description: "",
    finder: "",
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

    try {

        const user = JSON.parse(
            localStorage.getItem("user")
        );

        if (!user?._id) {

            alert("Please login before reporting an item.");

            return;

        }

        const data = new FormData();

        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("category", formData.category);
        data.append("location", formData.location);
        data.append("dateFound", formData.date);
        data.append("reportedBy", user._id);

        if (image) {
            data.append("image", image);
        }

        const response = await reportFoundItem(data);

        if (response.success) {

    alert("Found Item Submitted Successfully!");

    navigate("/browse/found");

        } else {

            alert(
                response.message ||
                "Unable to submit found item."
            );

        }

    } catch (error) {

        console.error(error);

        alert("Unable to connect to server.");

    }

};

  return (

    <>

      <Navbar />

      <section className="reportfound-page">

        <div className="container">

          <motion.div
            className="reportfound-header"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .6 }}
          >

            <span className="reportfound-tag">
              Help Someone Recover Their Belongings
            </span>

            <h1>
              Report Found Item
            </h1>

            <p>
              Found something on campus? Submit its details so the owner can reclaim it.
            </p>

          </motion.div>

          <motion.form
            className="reportfound-form"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .2 }}
            onSubmit={handleSubmit}
          >

            <div className="upload-section">

              <label htmlFor="foundImage">

                {preview ? (

                  <img
                    src={preview}
                    alt="preview"
                    className="preview-image"
                  />

                ) : (

                  <>

                    <FaCloudUploadAlt className="upload-icon" />

                    <h3>
                      Upload Found Item
                    </h3>

                    <p>
                      Drag & Drop
                      <br />
                      or click to browse
                    </p>

                  </>

                )}

              </label>

              <input
                id="foundImage"
                type="file"
                hidden
                accept="image/*"
                onChange={handleImage}
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

                  <option>Electronics</option>
                  <option>Wallet</option>
                  <option>Bag</option>
                  <option>Books</option>
                  <option>Keys</option>
                  <option>Accessories</option>

                </select>

              </div>

              <div className="input-group">

                <label>
                  <FaMapMarkerAlt />
                  Found At
                </label>

                <input
                  type="text"
                  name="location"
                  placeholder="Where did you find it?"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="input-group">

                <label>
                  <FaCalendarAlt />
                  Date Found
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
                  placeholder="Describe the item in detail. Mention its color, brand, unique marks, or anything that can help the owner identify it."
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
                  <FaUser />
                  Finder Name
                </label>

                <input
                  type="text"
                  name="finder"
                  value={formData.finder}
                  onChange={handleChange}
                  required
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
                id="confirmFound"
                required
              />

              <label htmlFor="confirmFound">

                I confirm that the information provided above is
                accurate and I will cooperate with the rightful
                owner during the verification process.

              </label>

            </div>

            <button
              type="submit"
              className="submit-btn"
            >
              Submit Found Report
            </button>

          </motion.form>

        </div>

      </section>

      <Footer />

    </>

  );

}