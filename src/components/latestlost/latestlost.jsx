import "./latestlost.css";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { FaHeart, FaRegHeart, FaMapMarkerAlt, FaClock, FaArrowRight } from "react-icons/fa";

import { getLostItems } from "../../services/itemService";

import { useNavigate } from "react-router-dom";


const API_URL = "http://localhost:5001";


export default function LatestLost() {

    const navigate = useNavigate();

    const [lostItems, setLostItems] = useState([]);

    const [favorites, setFavorites] = useState([]);

    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const fetchLostItems = async () => {

            try {

                const response = await getLostItems();

                if (response.success) {

                    const latestItems =
                        (response.lostItems || [])
                            .sort(
                                (a, b) =>
                                    new Date(b.createdAt) -
                                    new Date(a.createdAt)
                            )
                            .slice(0, 3);

                    setLostItems(latestItems);

                }

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        };


        fetchLostItems();

    }, []);


    const toggleFavorite = (id) => {

        setFavorites((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );

    };


    const getImageUrl = (image) => {

        if (!image) {
            return "/placeholder.png";
        }

        if (image.startsWith("http")) {
            return image;
        }

        return `${API_URL}${image}`;

    };


    const formatDate = (date) => {

        if (!date) {
            return "Recently";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );

    };


    if (loading) {
        return null;
    }


    return (

        <section className="latest-lost">

            <div className="container">

                <motion.div
                    className="lost-section-header"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: .7 }}
                    viewport={{ once: true }}
                >

                    <span className="section-tag red">
                        Recently Reported
                    </span>

                    <h2>
                        Latest Lost Items
                    </h2>

                    <p>
                        Browse the most recently reported lost belongings
                        across your campus.
                    </p>

                </motion.div>


                {lostItems.length > 0 ? (

                    <div className="lost-grid">

                        {lostItems.map((item, index) => (

                            <motion.div
                                key={item._id}
                                className="lost-card"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0
                                }}
                                transition={{
                                    delay: index * .15
                                }}
                                viewport={{ once: true }}
                                whileHover={{ y: -10 }}
                                onClick={() =>
                                    navigate(
                                        `/item/${item._id}?type=lost`
                                    )
                                }
                            >

                                <div className="image-box">

                                    <img
                                        src={getImageUrl(item.image)}
                                        alt={item.title}
                                    />

                                    <button
                                        className="favorite-btn lost"
                                        onClick={(e) => {

                                            e.stopPropagation();

                                            toggleFavorite(item._id);

                                        }}
                                    >

                                        {favorites.includes(item._id)
                                            ? <FaHeart />
                                            : <FaRegHeart />
                                        }

                                    </button>


                                    <span className="lost-status">
                                        LOST
                                    </span>

                                </div>


                                <div className="lost-content">

                                    <h3>
                                        {item.title}
                                    </h3>


                                    <div className="info">

                                        <span>
                                            <FaMapMarkerAlt />
                                            {item.location}
                                        </span>

                                        <span>
                                            <FaClock />
                                            {formatDate(item.dateLost)}
                                        </span>

                                    </div>


                                    <div className="lost-category">
                                        {item.category}
                                    </div>


                                    <button
                                        onClick={(e) => {

                                            e.stopPropagation();

                                            navigate(
                                                `/item/${item._id}?type=lost`
                                            );

                                        }}
                                    >

                                        View Details

                                        <FaArrowRight />

                                    </button>

                                </div>

                            </motion.div>

                        ))}

                    </div>

                ) : (

                    <div className="browse-empty">

                        <h3>
                            No lost items yet
                        </h3>

                        <p>
                            Be the first to report a lost item.
                        </p>

                    </div>

                )}


                <motion.div
                    className="view-all-container"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{
                        opacity: 1,
                        y: 0
                    }}
                    transition={{ duration: .6 }}
                    viewport={{ once: true }}
                >

                    <button
                        className="view-all-lost-btn"
                        onClick={() => navigate("/browse?type=lost")}
                    >

                        View All Lost Items

                        <FaArrowRight />

                    </button>

                </motion.div>

            </div>

        </section>

    );

}