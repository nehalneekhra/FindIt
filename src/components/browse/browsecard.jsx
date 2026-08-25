import "./browsecard.css";

import { useState } from "react";

import { motion } from "framer-motion";

import ItemModal from "../modal/itemmodal";

import {
    FaHeart,
    FaRegHeart,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaArrowRight
} from "react-icons/fa";


export default function BrowseCard({ item, type }) {

    const [favorite, setFavorite] = useState(false);

    const [open, setOpen] = useState(false);


    /*
     * MongoDB stores different date fields
     * for lost and found items.
     */
    const itemDate =
        type === "lost"
            ? item.dateLost
            : item.dateFound;


    /*
     * Format date nicely for the card.
     */
    const formattedDate = itemDate
        ? new Date(itemDate).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        })
        : "Date not available";


    /*
     * Use a fallback image if the user
     * did not upload an image.
     */
    const imageSrc =
    item.image && item.image.trim() !== ""
        ? `http://localhost:5001${item.image}`
        : "/placeholder-item.png";


    return (

        <>

            <motion.div

                className="browse-card"

                whileHover={{
                    y: -10,
                    scale: 1.02
                }}

                transition={{
                    duration: 0.25
                }}

            >

                {/* IMAGE */}

                <div
                    className="browse-image"
                    onClick={() => setOpen(true)}
                >

                    <img
                        src={imageSrc}
                        alt={item.title || "Item"}
                    />


                    {/* FAVORITE */}

                    <button

                        className={`browse-favorite ${type}`}

                        onClick={(e) => {

                            e.stopPropagation();

                            setFavorite(!favorite);

                        }}

                    >

                        {favorite
                            ? <FaHeart />
                            : <FaRegHeart />
                        }

                    </button>


                    {/* STATUS */}

                    <span
                        className={`browse-status ${type}`}
                    >

                        {type === "lost"
                            ? "LOST"
                            : "FOUND"
                        }

                    </span>

                </div>


                {/* CONTENT */}

                <div className="browse-content">

                    <h3>
                        {item.title}
                    </h3>


                    {/* LOCATION + DATE */}

                    <div className="browse-info">

                        <span>

                            <FaMapMarkerAlt />

                            {item.location || "Location unavailable"}

                        </span>


                        <span>

                            <FaCalendarAlt />

                            {formattedDate}

                        </span>

                    </div>


                    {/* CATEGORY */}

                    <div className="browse-category">

                        {item.category || "Other"}

                    </div>


                    {/* VIEW DETAILS */}

                    <button

                        className="browse-btn"

                        onClick={() => setOpen(true)}

                    >

                        View Details

                        <FaArrowRight />

                    </button>

                </div>

            </motion.div>


            {/* MODAL */}

            <ItemModal
    item={open ? item : null}
    type={type}
    onClose={() => setOpen(false)}
/>

        </>

    );

}