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
    FaSave
} from "react-icons/fa";

import {
    getLostItems,
    getFoundItems,
    deleteLostItem,
    deleteFoundItem,
    updateLostItem,
    updateFoundItem
} from "../services/itemService";


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
                    item._id
                );
            } else {

                response = await deleteFoundItem(
                    item._id
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
                    formData
              );

            } else {

                response = await updateFoundItem(
                     editingItem._id,
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