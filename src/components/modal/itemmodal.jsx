import "./itemmodal.css";

import { motion, AnimatePresence } from "framer-motion";

import {
    FaTimes,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaUser,
    FaTag
} from "react-icons/fa";

export default function ItemModal({ item, type, onClose }) {

    if (!item) return null;

    // Backend image URL
    const imageSrc =
        item.image && item.image.trim() !== ""
            ? item.image.startsWith("http")
                ? item.image
                : `${import.meta.env.VITE_API_URL}${item.image}`
            : "/placeholder-item.png";


    // Lost and Found use different date fields
    const itemDate =
        type === "lost"
            ? item.dateLost
            : item.dateFound;


    // Format date
    const formattedDate = itemDate
        ? new Date(itemDate).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        })
        : "Date not available";


    // Get reporter information
    const reporterName =
        item.reportedBy?.name ||
        item.finder ||
        "Not available";


    const reporterEmail =
        item.reportedBy?.email ||
        item.email ||
        "";


    return (

        <AnimatePresence>

            <motion.div

                className="modal-overlay"

                initial={{ opacity: 0 }}

                animate={{ opacity: 1 }}

                exit={{ opacity: 0 }}

                onClick={onClose}

            >

                <motion.div

                    className="modal-box"

                    initial={{
                        scale: 0.85,
                        opacity: 0
                    }}

                    animate={{
                        scale: 1,
                        opacity: 1
                    }}

                    exit={{
                        scale: 0.85,
                        opacity: 0
                    }}

                    transition={{
                        duration: 0.3
                    }}

                    onClick={(e) =>
                        e.stopPropagation()
                    }

                >

                    {/* CLOSE BUTTON */}

                    <button

                        className="close-btn"

                        onClick={onClose}

                    >

                        <FaTimes />

                    </button>


                    {/* IMAGE */}

                    <motion.img

                        src={imageSrc}

                        alt={item.title || "Item"}

                        className="modal-image"

                        initial={{
                            scale: 1.1
                        }}

                        animate={{
                            scale: 1
                        }}

                        transition={{
                            duration: 0.6
                        }}

                        onError={(e) => {

                            e.currentTarget.src =
                                "/placeholder-item.png";

                        }}

                    />


                    {/* CONTENT */}

                    <div className="modal-content">

                        <h2>
                            {item.title}
                        </h2>


                        <div className="modal-info">

                            {/* LOCATION */}

                            <span>

                                <FaMapMarkerAlt />

                                {item.location ||
                                    "Location unavailable"}

                            </span>


                            {/* DATE */}

                            <span>

                                <FaCalendarAlt />

                                {formattedDate}

                            </span>


                            {/* REPORTER */}

                            <span>

                                <FaUser />

                                {reporterName}

                            </span>


                            {/* CATEGORY */}

                            <span>

                                <FaTag />

                                {item.category ||
                                    "Other"}

                            </span>

                        </div>


                        {/* DESCRIPTION */}

                        <p className="modal-description">

                            {item.description ||
                                "No description available for this item."}

                        </p>


                        {/* CONTACT / CLAIM */}

                        <button

                            className="claim-btn"

                            onClick={() => {

                                if (reporterEmail) {

                                    window.location.href =
                                        `mailto:${reporterEmail}`;

                                }

                            }}

                        >

                            {type === "lost"
                                ? "Contact Finder"
                                : "Contact Finder"
                            }

                        </button>

                    </div>

                </motion.div>

            </motion.div>

        </AnimatePresence>

    );

}