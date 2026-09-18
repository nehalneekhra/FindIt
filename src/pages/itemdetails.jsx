import "../components/itemdetails/itemdetails.css";

import Navbar from "../components/layout/navbar";
import Footer from "../components/footer/footer";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaUser,
    FaPhone,
    FaEnvelope,
    FaTag,
    FaArrowLeft,
    FaSearch,
    FaBoxOpen
} from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

export default function ItemDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [item, setItem] = useState(null);
    const [itemType, setItemType] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /*
     * Fetch item
     *
     * Since the URL currently contains only the ID,
     * we check the Lost collection first.
     *
     * If it isn't there, we check the Found collection.
     */
    useEffect(() => {

        const fetchItem = async () => {

            try {

                setLoading(true);
                setError("");

                /*
                 * First check Lost items
                 */
                const lostResponse = await fetch(
                    `${API_URL}/api/lost/${id}`
                );

                if (lostResponse.ok) {

                    const lostData = await lostResponse.json();

                    if (
                        lostData.success &&
                        lostData.lostItem
                    ) {

                        setItem(lostData.lostItem);
                        setItemType("lost");

                        return;
                    }
                }

                /*
                 * If not found in Lost,
                 * check Found items.
                 */
                const foundResponse = await fetch(
                    `${API_URL}/api/found/${id}`
                );

                if (foundResponse.ok) {

                    const foundData = await foundResponse.json();

                    if (
                        foundData.success &&
                        foundData.foundItem
                    ) {

                        setItem(foundData.foundItem);
                        setItemType("found");

                        return;
                    }
                }

                /*
                 * Item doesn't exist
                 */
                setError("This item could not be found.");

            } catch (error) {

                console.error(
                    "Unable to fetch item:",
                    error
                );

                setError(
                    "Unable to load item details. Please try again."
                );

            } finally {

                setLoading(false);

            }
        };

        if (id) {
            fetchItem();
        }

    }, [id]);


    /*
     * Format date
     */
    const formatDate = (date) => {

        if (!date) {
            return "Date unavailable";
        }

        const formattedDate = new Date(date);

        if (Number.isNaN(formattedDate.getTime())) {
            return "Date unavailable";
        }

        return formattedDate.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );
    };


    /*
     * Get image URL
     */
    const getImageUrl = (image) => {

        if (!image) {
            return "/placeholder-item.png";
        }

        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        return `${API_URL}${image}`;
    };


    /*
     * Loading screen
     */
    if (loading) {

        return (
            <>
                <Navbar />

                <main className="item-details-page">

                    <div className="item-details-loading">

                        <div className="details-spinner"></div>

                        <p>
                            Loading item details...
                        </p>

                    </div>

                </main>

                <Footer />
            </>
        );
    }


    /*
     * Error screen
     */
    if (error || !item) {

        return (
            <>
                <Navbar />

                <main className="item-details-page">

                    <div className="item-details-error">

                        <div className="details-error-icon">
                            <FaBoxOpen />
                        </div>

                        <h2>
                            Item Not Found
                        </h2>

                        <p>
                            {error ||
                                "This item is no longer available."
                            }
                        </p>

                        <button
                            onClick={() =>
                                navigate("/browse")
                            }
                        >
                            <FaArrowLeft />
                            Back to Browse
                        </button>

                    </div>

                </main>

                <Footer />
            </>
        );
    }


    /*
     * Item-specific data
     */
    const itemDate =
        itemType === "lost"
            ? item.dateLost
            : item.dateFound;

    const reportedBy = item.reportedBy;

    const reporterName =
        reportedBy?.name ||
        "FindIt User";


    /*
     * Main page
     */
    return (
        <>
            <Navbar />

            <main className="item-details-page">

                <div className="item-details-container">

                    {/* BACK BUTTON */}

                    <button
                        className="details-back-btn"
                        onClick={() => navigate(-1)}
                    >
                        <FaArrowLeft />
                        Back
                    </button>


                    {/* MAIN CARD */}

                    <div className="item-details-card">

                        {/* IMAGE */}

                        <div className="item-details-image">

                            <img
                                src={getImageUrl(item.image)}
                                alt={item.title}
                                onError={(e) => {
                                    e.currentTarget.src =
                                        "/placeholder-item.png";
                                }}
                            />

                            <span
                                className={`details-status ${itemType}`}
                            >
                                {itemType === "lost"
                                    ? "LOST"
                                    : "FOUND"
                                }
                            </span>

                        </div>


                        {/* CONTENT */}

                        <div className="item-details-content">

                            {/* CATEGORY */}

                            <span className="details-category">

                                <FaTag />

                                {item.category || "Other"}

                            </span>


                            {/* TITLE */}

                            <h1>
                                {item.title}
                            </h1>


                            {/* DESCRIPTION */}

                            <div className="details-description">

                                <h3>
                                    Description
                                </h3>

                                <p>
                                    {item.description ||
                                        "No description available for this item."
                                    }
                                </p>

                            </div>


                            {/* INFORMATION */}

                            <div className="details-info-grid">

                                {/* LOCATION */}

                                <div className="details-info-item">

                                    <div className="details-info-icon">
                                        <FaMapMarkerAlt />
                                    </div>

                                    <div>

                                        <span>
                                            Location
                                        </span>

                                        <strong>
                                            {item.location ||
                                                "Not specified"
                                            }
                                        </strong>

                                    </div>

                                </div>


                                {/* DATE */}

                                <div className="details-info-item">

                                    <div className="details-info-icon">
                                        <FaCalendarAlt />
                                    </div>

                                    <div>

                                        <span>
                                            {itemType === "lost"
                                                ? "Date Lost"
                                                : "Date Found"
                                            }
                                        </span>

                                        <strong>
                                            {formatDate(itemDate)}
                                        </strong>

                                    </div>

                                </div>


                                {/* REPORTED BY */}

                                <div className="details-info-item">

                                    <div className="details-info-icon">
                                        <FaUser />
                                    </div>

                                    <div>

                                        <span>
                                            Reported By
                                        </span>

                                        <strong>
                                            {reporterName}
                                        </strong>

                                    </div>

                                </div>


                                {/* STATUS */}

                                <div className="details-info-item">

                                    <div className="details-info-icon">

                                        {itemType === "lost"
                                            ? <FaSearch />
                                            : <FaBoxOpen />
                                        }

                                    </div>

                                    <div>

                                        <span>
                                            Status
                                        </span>

                                        <strong>
                                            {item.status ||
                                                (
                                                    itemType === "lost"
                                                        ? "Lost"
                                                        : "Found"
                                                )
                                            }
                                        </strong>

                                    </div>

                                </div>

                            </div>


                            {/* REWARD */}

                            {itemType === "lost" &&
                                item.reward && (

                                    <div className="details-reward">

                                        <span>
                                            Reward Offered
                                        </span>

                                        <strong>
                                            ₹{item.reward}
                                        </strong>

                                    </div>

                                )
                            }


                            {/* CONTACT */}

                            <div className="details-contact">

                                <div>

                                    <h3>
                                        {itemType === "lost"
                                            ? "Found this item?"
                                            : "Is this your item?"
                                        }
                                    </h3>

                                    <p>
                                        {itemType === "lost"
                                            ? "If you believe you found this item, contact the person who reported it."
                                            : "If this item belongs to you, contact the person who found it."
                                        }
                                    </p>

                                </div>


                                <div className="details-contact-buttons">

                                    {/* PHONE */}

                                    {item.phone && (

                                        <a
                                            href={`tel:${item.phone}`}
                                            className="details-contact-btn phone"
                                        >
                                            <FaPhone />
                                            Call
                                        </a>

                                    )}


                                    {/* EMAIL */}

                                    {item.email && (

                                        <a
                                            href={`mailto:${item.email}`}
                                            className="details-contact-btn email"
                                        >
                                            <FaEnvelope />
                                            Email
                                        </a>

                                    )}


                                    {/* NO CONTACT */}

                                    {!item.phone &&
                                        !item.email && (

                                            <button
                                                className="details-contact-btn disabled"
                                                disabled
                                            >
                                                Contact information unavailable
                                            </button>

                                        )
                                    }

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </main>

            <Footer />
        </>
    );
}