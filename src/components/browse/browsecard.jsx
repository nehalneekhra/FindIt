import "./browsecard.css";

import { useState } from "react";

import { motion } from "framer-motion";

import ItemModal from "../modal/itemmodal";

import { createClaim } from "../../services/claimService";

import {
    FaHeart,
    FaRegHeart,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaArrowRight,
    FaCheck,
    FaPaperPlane,
    FaTimes
} from "react-icons/fa";


export default function BrowseCard({ item, type }) {

    const [favorite, setFavorite] = useState(false);

    const [open, setOpen] = useState(false);

    const [claimOpen, setClaimOpen] = useState(false);

    const [claimMessage, setClaimMessage] = useState("");

    const [claimLoading, setClaimLoading] = useState(false);

    const [claimSubmitted, setClaimSubmitted] = useState(false);


    /*
     * Get logged-in user
     */
    const storedUser = localStorage.getItem("user");

    let user = null;

    try {
        user = storedUser
            ? JSON.parse(storedUser)
            : null;
    } catch (error) {
        console.error("Unable to read user:", error);
    }


    /*
     * Check whether this item belongs
     * to the currently logged-in user.
     */
    const reportedBy =
        item.reportedBy?._id ||
        item.reportedBy;

    const isOwner =
        user?._id &&
        reportedBy &&
        String(reportedBy) === String(user._id);


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
        ? new Date(itemDate).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        )
        : "Date not available";


    /*
     * Use a fallback image if the user
     * did not upload an image.
     */
    const imageSrc =
    item.image &&
    item.image.trim() !== ""
        ? item.image.startsWith("http")
            ? item.image
            : `${import.meta.env.VITE_API_URL}${item.image}`
        : "/placeholder-item.png";


    /*
     * Submit claim
     */
    const handleClaim = async () => {

        if (!user) {
            alert("Please login to claim an item.");
            return;
        }

        if (isOwner) {
            alert("You cannot claim your own report.");
            return;
        }

        setClaimLoading(true);

        try {

            const response = await createClaim(
                item._id,
                claimMessage
            );

            if (response.success) {

                setClaimSubmitted(true);

                setClaimMessage("");

                alert(
                    "Your claim has been submitted successfully!"
                );

            } else {

                alert(
                    response.message ||
                    "Unable to submit claim."
                );

            }

        } catch (error) {

            console.error(
                "Claim submission error:",
                error
            );

            alert(
                "Something went wrong while submitting your claim."
            );

        } finally {

            setClaimLoading(false);

        }
    };


    /*
     * Close claim modal
     */
    const closeClaimModal = () => {

        if (claimLoading) {
            return;
        }

        setClaimOpen(false);

        setClaimMessage("");

    };


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
                            : item.status === "claimed"
                                ? "CLAIMED"
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

                            {item.location ||
                                "Location unavailable"}

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


                    {/* =========================
                        OWNER / CLAIM SECTION
                    ========================= */}

                    {type === "found" && (

                        <>

                            {/* OWNER */}



                            {/* ALREADY CLAIMED */}

                            {!isOwner &&
                                item.status === "claimed" && (

                                    <div
                                        style={{
                                            marginTop: "10px",
                                            width: "100%",
                                            padding: "10px 14px",
                                            borderRadius: "8px",
                                            background: "rgba(34, 197, 94, 0.10)",
                                            border: "1px solid rgba(34, 197, 94, 0.30)",
                                            color: "#86efac",
                                            fontSize: "13px",
                                            fontWeight: "600",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "8px"
                                        }}
                                    >

                                        <FaCheck />

                                        Item has been claimed

                                    </div>

                                )}


                            {/* CLAIM BUTTON */}

                            {!isOwner &&
                                item.status !== "claimed" && (

                                    <button

    type="button"

    className="browse-claim-btn"

    onClick={(e) => {

        e.stopPropagation();

        if (!user) {

            alert(
                "Please login to claim an item."
            );

            return;

        }

        if (!claimSubmitted) {
            setClaimOpen(true);
        }

    }}

>

    {claimSubmitted
        ? (
            <>
                <FaCheck />
                Claim Submitted
            </>
        )
        : (
            <>
                Claim This Item
            </>
        )
    }

</button>

                                )}

                        </>

                    )}

                </div>

            </motion.div>


            {/* =========================
                ITEM DETAILS MODAL
            ========================= */}

            <ItemModal
                item={open ? item : null}
                type={type}
                onClose={() => setOpen(false)}
            />


            {/* =========================
                CLAIM MODAL
            ========================= */}

            {claimOpen && (

                <div
                    onClick={closeClaimModal}
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 9999,
                        background: "rgba(5, 8, 20, 0.78)",
                        backdropFilter: "blur(8px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "20px"
                    }}
                >

                    <div
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                        style={{
                            width: "100%",
                            maxWidth: "500px",
                            background: "#171d31",
                            border: "1px solid rgba(139, 92, 246, 0.35)",
                            borderRadius: "18px",
                            padding: "28px",
                            boxShadow: "0 25px 80px rgba(0, 0, 0, 0.45)"
                        }}
                    >

                        {/* HEADER */}

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: "22px"
                            }}
                        >

                            <div>

                                <h2
                                    style={{
                                        margin: 0,
                                        color: "#ffffff",
                                        fontSize: "22px"
                                    }}
                                >
                                    Claim This Item
                                </h2>

                                <p
                                    style={{
                                        margin: "7px 0 0",
                                        color: "#9ca3b8",
                                        fontSize: "13px"
                                    }}
                                >
                                    Tell the finder why you believe
                                    this item belongs to you.
                                </p>

                            </div>


                            <button

                                type="button"

                                onClick={closeClaimModal}

                                disabled={claimLoading}

                                style={{
                                    width: "34px",
                                    height: "34px",
                                    borderRadius: "50%",
                                    border: "none",
                                    background: "rgba(255,255,255,0.08)",
                                    color: "#cbd5e1",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}

                            >

                                <FaTimes />

                            </button>

                        </div>


                        {/* ITEM PREVIEW */}

                        <div
                            style={{
                                display: "flex",
                                gap: "14px",
                                padding: "13px",
                                borderRadius: "12px",
                                background: "rgba(255,255,255,0.04)",
                                marginBottom: "20px"
                            }}
                        >

                            <img
                                src={imageSrc}
                                alt={item.title || "Item"}
                                style={{
                                    width: "65px",
                                    height: "65px",
                                    objectFit: "cover",
                                    borderRadius: "9px"
                                }}
                            />

                            <div>

                                <h3
                                    style={{
                                        margin: "3px 0 5px",
                                        color: "#ffffff",
                                        fontSize: "16px"
                                    }}
                                >
                                    {item.title}
                                </h3>

                                <p
                                    style={{
                                        margin: 0,
                                        color: "#9ca3b8",
                                        fontSize: "13px"
                                    }}
                                >
                                    {item.category || "Other"}
                                </p>

                                <p
                                    style={{
                                        margin: "4px 0 0",
                                        color: "#9ca3b8",
                                        fontSize: "12px"
                                    }}
                                >
                                    {item.location ||
                                        "Location unavailable"}
                                </p>

                            </div>

                        </div>


                        {/* MESSAGE */}

                        <label
                            style={{
                                display: "block",
                                color: "#e5e7eb",
                                fontSize: "14px",
                                fontWeight: "600",
                                marginBottom: "8px"
                            }}
                        >
                            Why do you think this is your item?
                        </label>


                        <textarea

                            value={claimMessage}

                            onChange={(e) =>
                                setClaimMessage(e.target.value)
                            }

                            placeholder="Mention identifying details, where you lost it, unique marks, etc."

                            rows="5"

                            disabled={claimLoading}

                            style={{
                                width: "100%",
                                boxSizing: "border-box",
                                resize: "vertical",
                                padding: "13px",
                                borderRadius: "10px",
                                border: "1px solid rgba(255,255,255,0.12)",
                                background: "#101629",
                                color: "#ffffff",
                                outline: "none",
                                fontSize: "14px",
                                fontFamily: "inherit"
                            }}

                        />


                        {/* ACTIONS */}

                        <div
                            style={{
                                display: "flex",
                                gap: "10px",
                                marginTop: "18px"
                            }}
                        >

                            <button

                                type="button"

                                onClick={closeClaimModal}

                                disabled={claimLoading}

                                style={{
                                    flex: 1,
                                    padding: "12px",
                                    borderRadius: "9px",
                                    border: "1px solid rgba(255,255,255,0.12)",
                                    background: "transparent",
                                    color: "#cbd5e1",
                                    cursor: "pointer",
                                    fontWeight: "600"
                                }}

                            >

                                Cancel

                            </button>


                            <button

                                type="button"

                                onClick={handleClaim}

                                disabled={claimLoading}

                                style={{
                                    flex: 1,
                                    padding: "12px",
                                    border: "none",
                                    borderRadius: "9px",
                                    background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                                    color: "#ffffff",
                                    cursor: claimLoading
                                        ? "not-allowed"
                                        : "pointer",
                                    fontWeight: "700",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px",
                                    opacity: claimLoading
                                        ? 0.7
                                        : 1
                                }}

                            >

                                {claimLoading
                                    ? "Submitting..."
                                    : (
                                        <>
                                            <FaPaperPlane />
                                            Submit Claim
                                        </>
                                    )
                                }

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </>

    );

}