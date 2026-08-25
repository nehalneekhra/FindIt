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
    FaTimes
} from "react-icons/fa";

import {
    getLostItems,
    getFoundItems
} from "../services/itemService";


const API_URL = "http://localhost:5001";


export default function Dashboard() {

    const navigate = useNavigate();

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


    const [lostItems, setLostItems] = useState([]);
    const [foundItems, setFoundItems] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    /*
     * Redirect to login if user is not logged in
     */
    useEffect(() => {

        if (!user) {
            navigate("/login");
        }

    }, [user, navigate]);


    /*
     * Fetch user's reports
     */
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
                 * Only keep reports belonging
                 * to the logged-in user.
                 */

                const myLostItems =
                    (lostResponse.lostItems || []).filter(item => {

                        const reportedBy =
                            item.reportedBy?._id ||
                            item.reportedBy;

                        return reportedBy === user._id;

                    });


                const myFoundItems =
                    (foundResponse.foundItems || []).filter(item => {

                        const reportedBy =
                            item.reportedBy?._id ||
                            item.reportedBy;

                        return reportedBy === user._id;

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


    /*
     * Combine lost + found reports
     */
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


    /*
     * Format dates
     */
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


    /*
     * Get image URL
     */
    const getImageUrl = (image) => {

        if (!image) {
            return "/placeholder-item.png";
        }

        if (image.startsWith("http")) {
            return image;
        }

        return `${API_URL}${image}`;

    };


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
                                Welcome, {user.name?.split(" ")[0] || "User"} 👋
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
                                    {lostItems.length + foundItems.length}
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


                                        return (

                                            <div

                                                className={`dashboard-card ${item.reportType}`}

                                                key={`${item.reportType}-${item._id}`}

                                            >

                                                {/* IMAGE */}

                                                <div className="dashboard-card-image">

                                                    <img

                                                        src={getImageUrl(item.image)}

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

                                                            {formatDate(itemDate)}

                                                        </span>

                                                    </div>


                                                    <span className="dashboard-category">

                                                        {item.category || "Other"}

                                                    </span>


                                                    <p>

                                                        {item.description ||
                                                            "No description available."
                                                        }

                                                    </p>


                                                    <button

                                                        onClick={() =>
                                                            navigate(
                                                                `/item/${item._id}`
                                                            )
                                                        }

                                                    >

                                                        View Details

                                                        <FaArrowRight />

                                                    </button>

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


            <Footer />

        </>

    );

}