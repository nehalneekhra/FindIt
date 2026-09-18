import "./latestfound.css";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
    FaHeart,
    FaRegHeart,
    FaMapMarkerAlt,
    FaUser,
    FaArrowRight
} from "react-icons/fa";

import { getFoundItems } from "../../services/itemService";

import { useNavigate } from "react-router-dom";


const API_URL = import.meta.env.VITE_API_URL;


export default function LatestFound() {

    const navigate = useNavigate();

    const [foundItems, setFoundItems] = useState([]);

    const [favorites, setFavorites] = useState([]);

    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const fetchFoundItems = async () => {

            try {

                const response = await getFoundItems();

                if (response.success) {

                    const latestItems =
                        (response.foundItems || [])
                            .sort(
                                (a, b) =>
                                    new Date(b.createdAt) -
                                    new Date(a.createdAt)
                            )
                            .slice(0, 3);

                    setFoundItems(latestItems);

                }

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        };


        fetchFoundItems();

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


    // const formatDate = (date) => {

    //     if (!date) {
    //         return "Recently";
    //     }

    //     return new Date(date).toLocaleDateString(
    //         "en-IN",
    //         {
    //             day: "numeric",
    //             month: "short",
    //             year: "numeric"
    //         }
    //     );

    // };


    if (loading) {
        return null;
    }


    return (

        <section className="latest-found">

            <div className="container">

                <motion.div
                    className="found-section-header"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: .7 }}
                    viewport={{ once: true }}
                >

                    <span className="section-tag green">
                        Recently Found
                    </span>

                    <h2>
                        Latest Found Items
                    </h2>

                    <p>
                        Browse the latest items reported by students
                        waiting to be claimed.
                    </p>

                </motion.div>


                {foundItems.length > 0 ? (

                    <div className="found-grid">

                        {foundItems.map((item, index) => (

                            <motion.div
                                key={item._id}
                                className="found-card"
                                initial={{
                                    opacity: 0,
                                    y: 50
                                }}
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
                                        `/item/${item._id}?type=found`
                                    )
                                }
                            >

                                <div className="image-box">

                                    <img
                                        src={getImageUrl(item.image)}
                                        alt={item.title}
                                    />


                                    <button
                                        className="favorite-btn found"
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


                                    <span className="found-status">
                                        FOUND
                                    </span>

                                </div>


                                <div className="found-content">

                                    <h3>
                                        {item.title}
                                    </h3>


                                    <div className="info">

                                        <span>
                                            <FaMapMarkerAlt />
                                            {item.location}
                                        </span>

                                        <span>
                                            <FaUser />
                                            {item.reportedBy?.name ||
                                                "FindIt User"}
                                        </span>

                                    </div>


                                    <div className="found-category">
                                        {item.category}
                                    </div>


                                    <button
                                        onClick={(e) => {

                                            e.stopPropagation();

                                            navigate(
                                                `/item/${item._id}?type=found`
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
                            No found items yet
                        </h3>

                        <p>
                            Be the first to report a found item.
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
                        className="view-all-found-btn"
                        onClick={() => navigate("/browse?type=found")}
                    >

                        View All Found Items

                        <FaArrowRight />

                    </button>

                </motion.div>

            </div>

        </section>

    );

}