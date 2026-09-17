import "../components/dashboard/dashboard.css";

import Navbar from "../components/layout/navbar";
import Footer from "../components/footer/footer";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaBoxOpen,
    FaSearch,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaArrowRight,
    FaPlus,
    FaTimes,
    FaTrash,
    FaEdit,
    FaSave,
    FaUser,
    FaClock,
    FaCheckCircle,
    FaTimesCircle,
    FaEnvelope,
    FaPhone
} from "react-icons/fa";

import {
    getLostItems,
    getFoundItems,
    deleteLostItem,
    deleteFoundItem,
    updateLostItem,
    updateFoundItem
} from "../services/itemService";

import {
    getMyClaims,
    getReceivedClaims,
    updateClaimStatus
} from "../services/claimService";


const API_URL = "http://localhost:5001";


export default function Dashboard() {

    const navigate = useNavigate();


    /* =========================
       USER
    ========================= */

    const [user] = useState(() => {

        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            return null;
        }

        try {

            return JSON.parse(storedUser);

        } catch (error) {

            console.error("Unable to read user:", error);

            return null;

        }

    });


    /* =========================
       REPORT DATA
    ========================= */

    const [lostItems, setLostItems] = useState([]);
    const [foundItems, setFoundItems] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    /* =========================
       DELETE
    ========================= */

    const [deletingId, setDeletingId] = useState(null);


    /* =========================
       EDIT
    ========================= */

    const [editingItem, setEditingItem] = useState(null);

    const [editLoading, setEditLoading] = useState(false);

    const [editImage, setEditImage] = useState(null);


    const [editForm, setEditForm] = useState({

        title: "",
        description: "",
        category: "",
        location: "",
        date: "",
        reward: "",
        phone: "",
        email: ""

    });


    /* =========================
       CLAIMS
    ========================= */

    const [receivedClaims, setReceivedClaims] = useState([]);
    const [myClaims, setMyClaims] = useState([]);
    const [claimsLoading, setClaimsLoading] = useState(true);
    const [claimsError, setClaimsError] = useState("");
    const [processingClaimId, setProcessingClaimId] = useState(null);


    /* =========================
       REDIRECT IF NOT LOGGED IN
    ========================= */

    useEffect(() => {

        if (!user) {

            navigate("/login");

        }

    }, [user, navigate]);


    /* =========================
       FETCH REPORTS
    ========================= */

    useEffect(() => {

        if (!user?._id) {
            return;
        }


        const fetchReports = async () => {

            try {

                setLoading(true);
                setError("");


                const [lostResponse, foundResponse] =
                    await Promise.all([
                        getLostItems(),
                        getFoundItems()
                    ]);


                if (!lostResponse.success) {

                    throw new Error(
                        lostResponse.message ||
                        "Unable to fetch lost reports"
                    );

                }


                if (!foundResponse.success) {

                    throw new Error(
                        foundResponse.message ||
                        "Unable to fetch found reports"
                    );

                }


                /*
                 * Only show reports belonging
                 * to the logged-in user.
                 */

                const myLostItems =
                    (lostResponse.lostItems || []).filter(item => {

                        const reportedBy =
                            item.reportedBy?._id ||
                            item.reportedBy;

                        return (
                            String(reportedBy) ===
                            String(user._id)
                        );

                    });


                const myFoundItems =
                    (foundResponse.foundItems || []).filter(item => {

                        const reportedBy =
                            item.reportedBy?._id ||
                            item.reportedBy;

                        return (
                            String(reportedBy) ===
                            String(user._id)
                        );

                    });


                setLostItems(myLostItems);
                setFoundItems(myFoundItems);


            } catch (error) {

                console.error(error);

                setError(
                    "Unable to load your reports."
                );

            } finally {

                setLoading(false);

            }

        };


        fetchReports();

    }, [user]);


    /* =========================
       FETCH CLAIMS
    ========================= */

    useEffect(() => {

        if (!user?._id) {
            return;
        }

        const fetchClaims = async () => {

            try {

                setClaimsLoading(true);
                setClaimsError("");

                const [receivedResponse, myResponse] =
                    await Promise.all([
                        getReceivedClaims(),
                        getMyClaims()
                    ]);

                if (receivedResponse.success) {
                    setReceivedClaims(
                        receivedResponse.claims || []
                    );
                } else {
                    setReceivedClaims([]);
                }

                if (myResponse.success) {
                    setMyClaims(
                        myResponse.claims || []
                    );
                } else {
                    setMyClaims([]);
                }

                if (
                    !receivedResponse.success &&
                    !myResponse.success
                ) {
                    setClaimsError(
                        "Unable to load your claims."
                    );
                }

            } catch (error) {

                console.error(
                    "Unable to fetch claims:",
                    error
                );

                setClaimsError(
                    "Unable to load your claims."
                );

            } finally {

                setClaimsLoading(false);

            }

        };

        fetchClaims();

    }, [user]);


    /* =========================
       UPDATE CLAIM STATUS
    ========================= */

    const handleClaimStatus = async (claimId, status) => {

        const action =
            status === "accepted"
                ? "accept"
                : "reject";

        const confirmed = window.confirm(
            `Are you sure you want to ${action} this claim?`
        );

        if (!confirmed) {
            return;
        }

        try {

            setProcessingClaimId(claimId);

            const response =
                await updateClaimStatus(
                    claimId,
                    status
                );

            if (!response.success) {

                alert(
                    response.message ||
                    "Unable to update claim."
                );

                return;

            }

            const updatedClaim = response.claim;

            setReceivedClaims(prev =>
                prev.map(claim =>
                    claim._id === claimId
                        ? updatedClaim || { ...claim, status }
                        : claim
                )
            );

            if (
                status === "accepted" &&
                updatedClaim?.item?._id
            ) {

                setFoundItems(prev =>
                    prev.map(item =>
                        item._id ===
                        updatedClaim.item._id
                            ? {
                                ...item,
                                status: "claimed"
                            }
                            : item
                    )
                );

            }

            alert(
                status === "accepted"
                    ? "Claim accepted successfully."
                    : "Claim rejected successfully."
            );

        } catch (error) {

            console.error(error);

            alert(
                "Unable to update claim. Please try again."
            );

        } finally {

            setProcessingClaimId(null);

        }

    };


    /* =========================
       CLAIM DATE
    ========================= */

    const formatClaimDate = (date) => {

        if (!date) {
            return "Recently";
        }

        const formatted = new Date(date);

        if (Number.isNaN(formatted.getTime())) {
            return "Recently";
        }

        return formatted.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );

    };


    /* =========================
       CLAIM STATUS LABEL
    ========================= */

    const getClaimStatusLabel = (status) => {

        if (status === "accepted") {
            return "Accepted";
        }

        if (status === "rejected") {
            return "Rejected";
        }

        return "Pending";

    };


    /* =========================
       COMBINE REPORTS
    ========================= */

    const allReports = [

        ...lostItems.map(item => ({
            ...item,
            reportType: "lost"
        })),

        ...foundItems.map(item => ({
            ...item,
            reportType: "found"
        }))

    ].sort(
        (a, b) =>
            new Date(b.createdAt || 0) -
            new Date(a.createdAt || 0)
    );


    /* =========================
       DATE FORMAT
    ========================= */

    const formatDate = (date) => {

        if (!date) {

            return "Date unavailable";

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


    /* =========================
       IMAGE URL
    ========================= */

    const getImageUrl = (image) => {

        if (!image) {

            return "/placeholder-item.png";

        }


        if (image.startsWith("http")) {

            return image;

        }


        return `${API_URL}${image}`;

    };


    /* =========================
       DELETE REPORT
    ========================= */

    const handleDelete = async (item) => {

        const confirmed = window.confirm(
            `Are you sure you want to delete "${item.title}"?\n\nThis action cannot be undone.`
        );


        if (!confirmed) {
            return;
        }


        try {

            setDeletingId(item._id);


            let response;


            if (item.reportType === "lost") {

                response = await deleteLostItem(
                    item._id,
                    user._id
                );

            } else {

                response = await deleteFoundItem(
                    item._id,
                    user._id
                );

            }


            if (!response.success) {

                alert(
                    response.message ||
                    "Unable to delete report."
                );

                return;

            }


            if (item.reportType === "lost") {

                setLostItems(prev =>
                    prev.filter(
                        report =>
                            report._id !== item._id
                    )
                );

            } else {

                setFoundItems(prev =>
                    prev.filter(
                        report =>
                            report._id !== item._id
                    )
                );

            }


            alert(
                "Report deleted successfully."
            );


        } catch (error) {

            console.error(error);

            alert(
                "Unable to delete report. Please try again."
            );

        } finally {

            setDeletingId(null);

        }

    };


    /* =========================
       OPEN EDIT MODAL
    ========================= */

    const handleEdit = (item) => {

        setEditingItem(item);

        setEditImage(null);


        setEditForm({

            title: item.title || "",

            description:
                item.description || "",

            category:
                item.category || "",

            location:
                item.location || "",

            date:
                item.reportType === "lost"
                    ? item.dateLost
                        ? item.dateLost.split("T")[0]
                        : ""
                    : item.dateFound
                        ? item.dateFound.split("T")[0]
                        : "",

            reward:
                item.reward || "",

            phone:
                item.phone || "",

            email:
                item.email || ""

        });

    };


    /* =========================
       CLOSE EDIT MODAL
    ========================= */

    const handleCloseEdit = () => {

        if (editLoading) {
            return;
        }

        setEditingItem(null);

        setEditImage(null);

    };


    /* =========================
       EDIT FORM CHANGE
    ========================= */

    const handleEditChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setEditForm(prev => ({

            ...prev,

            [name]: value

        }));

    };


    /* =========================
       IMAGE CHANGE
    ========================= */

    const handleEditImage = (e) => {

        const file = e.target.files[0];


        if (!file) {
            return;
        }


        setEditImage(file);

    };


    /* =========================
       SAVE EDIT
    ========================= */

    const handleSaveEdit = async (e) => {

        e.preventDefault();


        if (!editingItem) {
            return;
        }


        try {

            setEditLoading(true);


            const formData = new FormData();


            formData.append(
                "title",
                editForm.title
            );

            formData.append(
                "description",
                editForm.description
            );

            formData.append(
                "category",
                editForm.category
            );

            formData.append(
                "location",
                editForm.location
            );


            if (editingItem.reportType === "lost") {

                formData.append(
                    "dateLost",
                    editForm.date
                );

                formData.append(
                    "reward",
                    editForm.reward
                );

                formData.append(
                    "phone",
                    editForm.phone
                );

                formData.append(
                    "email",
                    editForm.email
                );

            } else {

                formData.append(
                    "dateFound",
                    editForm.date
                );

            }


            if (editImage) {

                formData.append(
                    "image",
                    editImage
                );

            }


            let response;


            if (editingItem.reportType === "lost") {

                response = await updateLostItem(
                    editingItem._id,
                    user._id,
                    formData
                );

            } else {

                response = await updateFoundItem(
                    editingItem._id,
                    user._id,
                    formData
                );

            }


            if (!response.success) {

                alert(
                    response.message ||
                    "Unable to update report."
                );

                return;

            }


            /*
             * Update the card immediately
             * without refreshing the page.
             */

            const updatedItem =
                response.lostItem ||
                response.foundItem;


            if (editingItem.reportType === "lost") {

                setLostItems(prev =>
                    prev.map(item =>
                        item._id === editingItem._id
                            ? updatedItem
                            : item
                    )
                );

            } else {

                setFoundItems(prev =>
                    prev.map(item =>
                        item._id === editingItem._id
                            ? updatedItem
                            : item
                    )
                );

            }


            alert(
                "Report updated successfully."
            );


            handleCloseEdit();


        } catch (error) {

            console.error(error);

            alert(
                "Unable to update report. Please try again."
            );

        } finally {

            setEditLoading(false);

        }

    };


    /* =========================
       NO USER
    ========================= */

    if (!user) {

        return null;

    }


    return (

        <>

            <Navbar />


            <main className="dashboard-page">

                <div className="dashboard-container">


                    {/* HEADER */}

                    <section className="dashboard-header">

                        <div>

                            <span className="dashboard-tag">
                                My FindIt Dashboard
                            </span>

                            <h1>

                                Welcome,{" "}

                                {user.name?.split(" ")[0] ||
                                    "User"}{" "}

                                👋

                            </h1>

                            <p>

                                Keep track of the items you've reported
                                and everything you've submitted to FindIt.

                            </p>

                        </div>


                        <button

                            className="dashboard-report-btn"

                            onClick={() =>
                                navigate("/report-lost")
                            }

                        >

                            <FaPlus />

                            Report Item

                        </button>

                    </section>


                    {/* ERROR */}

                    {error && (

                        <div className="dashboard-error">

                            {error}

                            <button

                                onClick={() =>
                                    window.location.reload()
                                }

                            >

                                <FaTimes />

                            </button>

                        </div>

                    )}


                    {/* STATISTICS */}

                    <section className="dashboard-stats">


                        <div className="dashboard-stat-card">

                            <div className="stat-icon total">

                                <FaBoxOpen />

                            </div>

                            <div>

                                <span>
                                    Total Reports
                                </span>

                                <strong>
                                    {lostItems.length +
                                        foundItems.length}
                                </strong>

                            </div>

                        </div>


                        <div className="dashboard-stat-card">

                            <div className="stat-icon lost">

                                <FaSearch />

                            </div>

                            <div>

                                <span>
                                    Lost Reports
                                </span>

                                <strong>
                                    {lostItems.length}
                                </strong>

                            </div>

                        </div>


                        <div className="dashboard-stat-card">

                            <div className="stat-icon found">

                                <FaBoxOpen />

                            </div>

                            <div>

                                <span>
                                    Found Reports
                                </span>

                                <strong>
                                    {foundItems.length}
                                </strong>

                            </div>

                        </div>

                    </section>


                    {/* =========================
                        CLAIMS
                    ========================= */}

                    <section className="dashboard-claims-section">

                        <div className="section-heading">

                            <div>

                                <h2>
                                    Claims & Requests
                                </h2>

                                <p>
                                    Manage claims on your found items and track the items you've claimed.
                                </p>

                            </div>

                        </div>


                        {claimsError && (

                            <div className="claims-error">
                                {claimsError}
                            </div>

                        )}


                        {claimsLoading ? (

                            <div className="claims-empty">
                                <div className="loading-spinner"></div>
                                <p>Loading claims...</p>
                            </div>

                        ) : (

                            <div className="claims-columns">

                                {/* RECEIVED CLAIMS */}

                                <div className="claims-panel">

                                    <div className="claims-panel-header">

                                        <div>
                                            <span className="claims-panel-label received">
                                                Incoming
                                            </span>
                                            <h3>
                                                Claims on My Items
                                            </h3>
                                        </div>

                                        <span className="claims-count">
                                            {receivedClaims.filter(
                                                claim => claim.status === "pending"
                                            ).length}
                                        </span>

                                    </div>


                                    {receivedClaims.length === 0 ? (

                                        <div className="claims-empty-small">
                                            <FaBoxOpen />
                                            <p>No claims on your found items yet.</p>
                                        </div>

                                    ) : (

                                        <div className="claims-list">

                                            {receivedClaims.map(claim => {

                                                const claimant = claim.claimant || {};
                                                const claimItem = claim.item || {};
                                                const isProcessing =
                                                    processingClaimId === claim._id;

                                                return (

                                                    <div
                                                        className="claim-card"
                                                        key={claim._id}
                                                    >

                                                        <div className="claim-card-top">

                                                            <div className="claim-user">

                                                                <div className="claim-avatar">
                                                                    {claimant.profileImage ? (
                                                                        <img
                                                                            src={getImageUrl(
                                                                                claimant.profileImage
                                                                            )}
                                                                            alt={claimant.name || "User"}
                                                                        />
                                                                    ) : (
                                                                        <FaUser />
                                                                    )}
                                                                </div>

                                                                <div>
                                                                    <strong>
                                                                        {claimant.name || "FindIt User"}
                                                                    </strong>
                                                                    <span>
                                                                        {claim.status === "accepted"
                                                                            ? (claimant.email || "Email unavailable")
                                                                            : "Contact details available after acceptance"}
                                                                    </span>
                                                                </div>

                                                            </div>

                                                            <span
                                                                className={`claim-status-badge ${claim.status}`}
                                                            >
                                                                {claim.status === "accepted" && <FaCheckCircle />}
                                                                {claim.status === "rejected" && <FaTimesCircle />}
                                                                {claim.status === "pending" && <FaClock />}
                                                                {getClaimStatusLabel(claim.status)}
                                                            </span>

                                                        </div>


                                                        <div className="claim-item-name">
                                                            <span>Claim for</span>
                                                            <strong>
                                                                {claimItem.title || "Found item"}
                                                            </strong>
                                                        </div>

                                                        {claim.message && (
                                                            <div className="claim-message">
                                                                <span>Message</span>
                                                                <p>
                                                                    {claim.message}
                                                                </p>
                                                            </div>
                                                        )}

                                                        {claim.status === "accepted" && (
                                                            <div className="claim-contact-box">
                                                                <div className="claim-contact-title">
                                                                    <FaCheckCircle />
                                                                    Contact the claimant
                                                                </div>

                                                                <div className="claim-contact-details">
                                                                    {claimant.email && (
                                                                        <a
                                                                            href={`mailto:${claimant.email}`}
                                                                            className="claim-contact-link"
                                                                        >
                                                                            <FaEnvelope />
                                                                            {claimant.email}
                                                                        </a>
                                                                    )}

                                                                    {claimant.phone && (
                                                                        <a
                                                                            href={`tel:${claimant.phone}`}
                                                                            className="claim-contact-link"
                                                                        >
                                                                            <FaPhone />
                                                                            {claimant.phone}
                                                                        </a>
                                                                    )}

                                                                    {!claimant.email && !claimant.phone && (
                                                                        <span className="claim-contact-unavailable">
                                                                            Contact information unavailable
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="claim-date">
                                                            <FaCalendarAlt />
                                                            Submitted {formatClaimDate(claim.createdAt)}
                                                        </div>

                                                        {claim.status === "pending" && (
                                                            <div className="claim-actions">

                                                                <button
                                                                    className="claim-reject-btn"
                                                                    onClick={() =>
                                                                        handleClaimStatus(
                                                                            claim._id,
                                                                            "rejected"
                                                                        )
                                                                    }
                                                                    disabled={isProcessing}
                                                                >
                                                                    <FaTimesCircle />
                                                                    Reject
                                                                </button>

                                                                <button
                                                                    className="claim-accept-btn"
                                                                    onClick={() =>
                                                                        handleClaimStatus(
                                                                            claim._id,
                                                                            "accepted"
                                                                        )
                                                                    }
                                                                    disabled={isProcessing}
                                                                >
                                                                    <FaCheckCircle />
                                                                    {isProcessing ? "Updating..." : "Accept"}
                                                                </button>

                                                            </div>
                                                        )}

                                                    </div>

                                                );

                                            })}

                                        </div>

                                    )}

                                </div>


                                {/* MY CLAIMS */}

                                <div className="claims-panel">

                                    <div className="claims-panel-header">

                                        <div>
                                            <span className="claims-panel-label submitted">
                                                Submitted
                                            </span>
                                            <h3>
                                                My Claims
                                            </h3>
                                        </div>

                                        <span className="claims-count">
                                            {myClaims.length}
                                        </span>

                                    </div>


                                    {myClaims.length === 0 ? (

                                        <div className="claims-empty-small">
                                            <FaSearch />
                                            <p>You haven't claimed any items yet.</p>
                                        </div>

                                    ) : (

                                        <div className="claims-list">

                                            {myClaims.map(claim => {

                                                const finder = claim.finder || {};
                                                const claimItem = claim.item || {};

                                                return (

                                                    <div
                                                        className="claim-card"
                                                        key={claim._id}
                                                    >

                                                        <div className="claim-card-top">

                                                            <div className="claim-item-heading">
                                                                <span>Item</span>
                                                                <strong>
                                                                    {claimItem.title || "Found item"}
                                                                </strong>
                                                            </div>

                                                            <span
                                                                className={`claim-status-badge ${claim.status}`}
                                                            >
                                                                {claim.status === "accepted" && <FaCheckCircle />}
                                                                {claim.status === "rejected" && <FaTimesCircle />}
                                                                {claim.status === "pending" && <FaClock />}
                                                                {getClaimStatusLabel(claim.status)}
                                                            </span>

                                                        </div>

                                                        {claim.message && (
                                                            <div className="claim-message">
                                                                <span>Your message</span>
                                                                <p>
                                                                    {claim.message}
                                                                </p>
                                                            </div>
                                                        )}

                                                        <div className="claim-finder">
                                                            <FaUser />
                                                            <div>
                                                                <span>Found by</span>
                                                                <strong>
                                                                    {finder.name || "FindIt User"}
                                                                </strong>
                                                            </div>
                                                        </div>

                                                        {claim.status === "accepted" && (
                                                            <div className="claim-contact-box">
                                                                <div className="claim-contact-title">
                                                                    <FaCheckCircle />
                                                                    Contact the finder
                                                                </div>

                                                                <div className="claim-contact-details">
                                                                    {finder.email && (
                                                                        <a
                                                                            href={`mailto:${finder.email}`}
                                                                            className="claim-contact-link"
                                                                        >
                                                                            <FaEnvelope />
                                                                            {finder.email}
                                                                        </a>
                                                                    )}

                                                                    {finder.phone && (
                                                                        <a
                                                                            href={`tel:${finder.phone}`}
                                                                            className="claim-contact-link"
                                                                        >
                                                                            <FaPhone />
                                                                            {finder.phone}
                                                                        </a>
                                                                    )}

                                                                    {!finder.email && !finder.phone && (
                                                                        <span className="claim-contact-unavailable">
                                                                            Contact information unavailable
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {claim.status === "rejected" && (
                                                            <div className="claim-contact-rejected">
                                                                <FaTimesCircle />
                                                                <span>
                                                                    This claim was rejected by the finder.
                                                                </span>
                                                            </div>
                                                        )}

                                                        <div className="claim-date">
                                                            <FaCalendarAlt />
                                                            Submitted {formatClaimDate(claim.createdAt)}
                                                        </div>

                                                    </div>

                                                );

                                            })}

                                        </div>

                                    )}

                                </div>

                            </div>

                        )}

                    </section>


                    {/* REPORTS */}

                    <section className="dashboard-reports">


                        <div className="section-heading">

                            <div>

                                <h2>
                                    My Reports
                                </h2>

                                <p>
                                    Items you've reported on FindIt
                                </p>

                            </div>


                            <button

                                onClick={() =>
                                    navigate("/browse")
                                }

                                className="view-all-btn"

                            >

                                Browse All

                                <FaArrowRight />

                            </button>

                        </div>


                        {/* LOADING */}

                        {loading && (

                            <div className="dashboard-empty">

                                <div className="loading-spinner"></div>

                                <p>
                                    Loading your reports...
                                </p>

                            </div>

                        )}


                        {/* NO REPORTS */}

                        {!loading &&
                            !error &&
                            allReports.length === 0 && (

                                <div className="dashboard-empty">

                                    <div className="empty-icon">

                                        <FaBoxOpen />

                                    </div>

                                    <h3>
                                        No reports yet
                                    </h3>

                                    <p>
                                        You haven't reported any lost
                                        or found items yet.
                                    </p>

                                    <button

                                        onClick={() =>
                                            navigate("/report-lost")
                                        }

                                    >

                                        Report Your First Item

                                        <FaArrowRight />

                                    </button>

                                </div>

                            )
                        }


                        {/* REPORT CARDS */}

                        {!loading &&
                            !error &&
                            allReports.length > 0 && (

                                <div className="dashboard-grid">

                                    {allReports.map(item => {

                                        const itemDate =
                                            item.reportType === "lost"
                                                ? item.dateLost
                                                : item.dateFound;


                                        const isDeleting =
                                            deletingId === item._id;


                                        return (

                                            <div

                                                className={`dashboard-card ${item.reportType}`}

                                                key={`${item.reportType}-${item._id}`}

                                            >

                                                {/* IMAGE */}

                                                <div className="dashboard-card-image">

                                                    <img

                                                        src={getImageUrl(
                                                            item.image
                                                        )}

                                                        alt={item.title}

                                                    />

                                                    <span

                                                        className={`dashboard-status ${item.reportType}`}

                                                    >

                                                        {item.reportType === "lost"
                                                            ? "LOST"
                                                            : "FOUND"
                                                        }

                                                    </span>

                                                </div>


                                                {/* CONTENT */}

                                                <div className="dashboard-card-content">

                                                    <h3>
                                                        {item.title}
                                                    </h3>


                                                    <div className="dashboard-card-info">

                                                        <span>

                                                            <FaMapMarkerAlt />

                                                            {item.location}

                                                        </span>


                                                        <span>

                                                            <FaCalendarAlt />

                                                            {formatDate(
                                                                itemDate
                                                            )}

                                                        </span>

                                                    </div>


                                                    <span className="dashboard-category">

                                                        {item.category ||
                                                            "Other"}

                                                    </span>


                                                    <p>

                                                        {item.description ||
                                                            "No description available."
                                                        }

                                                    </p>


                                                    {/* ACTIONS */}

                                                    <div className="dashboard-card-actions">


                                                        {/* VIEW */}

                                                        <button

                                                            className="dashboard-view-btn"

                                                            onClick={() =>
                                                                navigate(
                                                                    `/item/${item._id}`
                                                                )
                                                            }

                                                        >

                                                            View Details

                                                            <FaArrowRight />

                                                        </button>


                                                        {/* EDIT */}

                                                        <button

                                                            className="dashboard-edit-btn"

                                                            onClick={() =>
                                                                handleEdit(item)
                                                            }

                                                            disabled={
                                                                isDeleting ||
                                                                editLoading
                                                            }

                                                            title="Edit report"

                                                        >

                                                            <FaEdit />

                                                            Edit

                                                        </button>


                                                        {/* DELETE */}

                                                        <button

                                                            className="dashboard-delete-btn"

                                                            onClick={() =>
                                                                handleDelete(item)
                                                            }

                                                            disabled={
                                                                isDeleting ||
                                                                editLoading
                                                            }

                                                            title="Delete report"

                                                        >

                                                            <FaTrash />

                                                            {isDeleting
                                                                ? "Deleting..."
                                                                : "Delete"
                                                            }

                                                        </button>


                                                    </div>

                                                </div>

                                            </div>

                                        );

                                    })}

                                </div>

                            )
                        }


                    </section>

                </div>

            </main>


            {/* =========================
                EDIT MODAL
            ========================= */}

            {editingItem && (

                <div

                    className="edit-modal-overlay"

                    onClick={handleCloseEdit}

                >

                    <div

                        className="edit-modal"

                        onClick={(e) =>
                            e.stopPropagation()
                        }

                    >

                        {/* HEADER */}

                        <div className="edit-modal-header">

                            <div>

                                <h2>
                                    Edit Report
                                </h2>

                                <p>

                                    Update your{" "}

                                    {editingItem.reportType}{" "}

                                    item details.

                                </p>

                            </div>


                            <button

                                type="button"

                                className="edit-close-btn"

                                onClick={handleCloseEdit}

                                disabled={editLoading}

                            >

                                <FaTimes />

                            </button>

                        </div>


                        {/* FORM */}

                        <form

                            className="edit-form"

                            onSubmit={handleSaveEdit}

                        >


                            {/* ITEM NAME */}

                            <div className="edit-form-group">

                                <label>
                                    Item Name
                                </label>

                                <input

                                    type="text"

                                    name="title"

                                    value={editForm.title}

                                    onChange={handleEditChange}

                                    required

                                />

                            </div>


                            {/* CATEGORY */}

                            <div className="edit-form-group">

                                <label>
                                    Category
                                </label>

                                <select

                                    name="category"

                                    value={editForm.category}

                                    onChange={handleEditChange}

                                    required

                                >

                                    <option value="">
                                        Select Category
                                    </option>

                                    <option value="Electronics">
                                        Electronics
                                    </option>

                                    <option value="Wallet">
                                        Wallet
                                    </option>

                                    <option value="Bag">
                                        Bag
                                    </option>

                                    <option value="Books">
                                        Books
                                    </option>

                                    <option value="Keys">
                                        Keys
                                    </option>

                                    <option value="Accessories">
                                        Accessories
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>

                                </select>

                            </div>


                            {/* LOCATION */}

                            <div className="edit-form-group">

                                <label>
                                    Location
                                </label>

                                <input

                                    type="text"

                                    name="location"

                                    value={editForm.location}

                                    onChange={handleEditChange}

                                    required

                                />

                            </div>


                            {/* DATE */}

                            <div className="edit-form-group">

                                <label>

                                    {editingItem.reportType === "lost"
                                        ? "Date Lost"
                                        : "Date Found"
                                    }

                                </label>

                                <input

                                    type="date"

                                    name="date"

                                    value={editForm.date}

                                    onChange={handleEditChange}

                                    required

                                />

                            </div>


                            {/* DESCRIPTION */}

                            <div className="edit-form-group full">

                                <label>
                                    Description
                                </label>

                                <textarea

                                    name="description"

                                    value={editForm.description}

                                    onChange={handleEditChange}

                                    maxLength="500"

                                    required

                                />

                            </div>


                            {/* LOST ONLY */}

                            {editingItem.reportType === "lost" && (

                                <>

                                    <div className="edit-form-group">

                                        <label>
                                            Reward
                                        </label>

                                        <input

                                            type="text"

                                            name="reward"

                                            value={editForm.reward}

                                            onChange={handleEditChange}

                                            placeholder="Optional"

                                        />

                                    </div>


                                    <div className="edit-form-group">

                                        <label>
                                            Phone
                                        </label>

                                        <input

                                            type="tel"

                                            name="phone"

                                            value={editForm.phone}

                                            onChange={handleEditChange}

                                            placeholder="Optional"

                                        />

                                    </div>


                                    <div className="edit-form-group full">

                                        <label>
                                            Email
                                        </label>

                                        <input

                                            type="email"

                                            name="email"

                                            value={editForm.email}

                                            onChange={handleEditChange}

                                            placeholder="Optional"

                                        />

                                    </div>

                                </>

                            )}


                            {/* IMAGE */}

                            <div className="edit-image-section">

                                <img

                                    src={getImageUrl(
                                        editingItem.image
                                    )}

                                    alt="Current item"

                                    className="edit-current-image"

                                />


                                <div className="edit-image-info">

                                    <p>
                                        Current image
                                    </p>

                                    <input

                                        type="file"

                                        accept="image/jpeg,image/jpg,image/png,image/webp"

                                        onChange={handleEditImage}

                                        className="edit-image-input"

                                    />

                                </div>

                            </div>


                            {/* ACTIONS */}

                            <div className="edit-form-actions">

                                <button

                                    type="button"

                                    className="edit-cancel-btn"

                                    onClick={handleCloseEdit}

                                    disabled={editLoading}

                                >

                                    <FaTimes />

                                    Cancel

                                </button>


                                <button

                                    type="submit"

                                    className="edit-save-btn"

                                    disabled={editLoading}

                                >

                                    <FaSave />

                                    {editLoading
                                        ? "Saving..."
                                        : "Save Changes"
                                    }

                                </button>

                            </div>


                        </form>

                    </div>

                </div>

            )}


            <Footer />

        </>

    );

}