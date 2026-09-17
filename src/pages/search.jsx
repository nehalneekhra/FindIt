import "../components/search/search.css";

import Navbar from "../components/layout/navbar";
import Footer from "../components/footer/footer";

import { getAllItems } from "../services/itemService";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaSearch,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaFilter,
    FaTimes
} from "react-icons/fa";


export default function Search() {

    const navigate = useNavigate();


    // ===========================
    // STATE
    // ===========================

    const [items, setItems] = useState([]);

    const [query, setQuery] = useState("");

    const [category, setCategory] = useState("All Categories");

    const [type, setType] = useState("All");

    const [sort, setSort] = useState("Newest First");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ===========================
    // FETCH ITEMS
    // ===========================

    useEffect(() => {

        const fetchItems = async () => {

            setLoading(true);
            setError("");

            try {

                const response = await getAllItems();

                if (response.success) {

                    setItems(response.items || []);

                } else {

                    setItems([]);

                    setError(
                        response.message ||
                        "Unable to load items."
                    );

                }

            } catch (err) {

                console.error(err);

                setItems([]);

                setError(
                    "Unable to load items. Please try again."
                );

            } finally {

                setLoading(false);

            }

        };


        fetchItems();

    }, []);


    // ===========================
    // CATEGORY LIST
    // ===========================

    const categories = useMemo(() => {

        const uniqueCategories = [
            ...new Set(
                items
                    .map(item => item.category)
                    .filter(Boolean)
            )
        ];

        return [
            "All Categories",
            ...uniqueCategories
        ];

    }, [items]);


    // ===========================
    // FILTER + SORT
    // ===========================

    const filteredItems = useMemo(() => {

        const searchText = query
            .trim()
            .toLowerCase();


        const filtered = items.filter(item => {

            const title =
                item.title?.toLowerCase() || "";

            const description =
                item.description?.toLowerCase() || "";

            const itemCategory =
                item.category?.toLowerCase() || "";

            const location =
                item.location?.toLowerCase() || "";


            // Search across multiple fields
            const matchesSearch =
                !searchText ||
                title.includes(searchText) ||
                description.includes(searchText) ||
                itemCategory.includes(searchText) ||
                location.includes(searchText);


            // Lost / Found filter
            const matchesType =
                type === "All" ||
                item.type === type.toLowerCase();


            // Category filter
            const matchesCategory =
                category === "All Categories" ||
                item.category === category;


            return (
                matchesSearch &&
                matchesType &&
                matchesCategory
            );

        });


        // ===========================
        // SORT
        // ===========================

        filtered.sort((a, b) => {

            const dateA = new Date(
                a.createdAt || a.dateLost || a.dateFound
            );

            const dateB = new Date(
                b.createdAt || b.dateLost || b.dateFound
            );


            if (sort === "Newest First") {

                return dateB - dateA;

            }

            return dateA - dateB;

        });


        return filtered;

    }, [
        items,
        query,
        category,
        type,
        sort
    ]);


    // ===========================
    // FORMAT DATE
    // ===========================

    const formatDate = (item) => {

        const date =
            item.dateLost ||
            item.dateFound ||
            item.createdAt;


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


    // ===========================
    // IMAGE URL
    // ===========================

    const getImageUrl = (item) => {

        if (!item.image) {
            return null;
        }


        if (
            item.image.startsWith("http://") ||
            item.image.startsWith("https://")
        ) {

            return item.image;

        }


        return `http://localhost:5001${item.image}`;

    };


    // ===========================
    // CLEAR SEARCH
    // ===========================

    const clearSearch = () => {

        setQuery("");

    };


    // ===========================
    // CLEAR FILTERS
    // ===========================

    const clearFilters = () => {

        setQuery("");

        setCategory("All Categories");

        setType("All");

        setSort("Newest First");

    };


    // ===========================
    // OPEN ITEM
    // ===========================

    const handleViewDetails = (item) => {

        navigate(`/item/${item._id}`);

    };


    return (
        <>
            <Navbar />


            <section className="search-page">

                <div className="container">


                    {/* ===========================
                        HEADER
                    =========================== */}

                    <motion.div
                        className="search-header"
                        initial={{
                            opacity: 0,
                            y: 40
                        }}
                        animate={{
                            opacity: 1,
                            y: 0
                        }}
                    >

                        <h1>
                            Search Lost & Found Items
                        </h1>

                        <p>
                            Find lost and found items reported across campus.
                        </p>

                    </motion.div>


                    {/* ===========================
                        SEARCH BAR
                    =========================== */}

                    <motion.div
                        className="search-box-wrapper"
                        initial={{
                            opacity: 0
                        }}
                        animate={{
                            opacity: 1
                        }}
                        transition={{
                            delay: 0.2
                        }}
                    >

                        <div className="search-box">

                            <FaSearch />


                            <input
                                type="text"
                                placeholder="Search by item, description, category or location..."
                                value={query}
                                onChange={(e) =>
                                    setQuery(e.target.value)
                                }
                            />


                            {query && (

                                <button
                                    className="clear-search-btn"
                                    onClick={clearSearch}
                                    type="button"
                                    aria-label="Clear search"
                                >

                                    <FaTimes />

                                </button>

                            )}

                        </div>

                    </motion.div>


                    {/* ===========================
                        FILTERS
                    =========================== */}

                    <div className="filter-row">


                        {/* CATEGORY */}

                        <div className="filter">

                            <FaFilter />

                            <select
                                value={category}
                                onChange={(e) =>
                                    setCategory(e.target.value)
                                }
                            >

                                {categories.map(cat => (

                                    <option
                                        key={cat}
                                        value={cat}
                                    >
                                        {cat}
                                    </option>

                                ))}

                            </select>

                        </div>


                        {/* TYPE */}

                        <div className="filter">

                            <select
                                value={type}
                                onChange={(e) =>
                                    setType(e.target.value)
                                }
                            >

                                <option value="All">
                                    Lost & Found
                                </option>

                                <option value="lost">
                                    Lost
                                </option>

                                <option value="found">
                                    Found
                                </option>

                            </select>

                        </div>


                        {/* SORT */}

                        <div className="filter">

                            <select
                                value={sort}
                                onChange={(e) =>
                                    setSort(e.target.value)
                                }
                            >

                                <option value="Newest First">
                                    Newest First
                                </option>

                                <option value="Oldest First">
                                    Oldest First
                                </option>

                            </select>

                        </div>


                        {/* CLEAR FILTERS */}

                        {(query ||
                            category !== "All Categories" ||
                            type !== "All" ||
                            sort !== "Newest First") && (

                            <button
                                className="clear-filters-btn"
                                onClick={clearFilters}
                                type="button"
                            >
                                <FaTimes />
                                Clear Filters
                            </button>

                        )}

                    </div>


                    {/* ===========================
                        RESULTS INFO
                    =========================== */}

                    {!loading && !error && (

                        <div className="search-results-info">

                            <p>

                                Showing{" "}

                                <strong>
                                    {filteredItems.length}
                                </strong>{" "}

                                {filteredItems.length === 1
                                    ? "item"
                                    : "items"}

                                {query && (
                                    <>
                                        {" "}for{" "}
                                        <strong>
                                            "{query}"
                                        </strong>
                                    </>
                                )}

                            </p>

                        </div>

                    )}


                    {/* ===========================
                        LOADING
                    =========================== */}

                    {loading && (

                        <div className="search-loading">

                            <div className="search-spinner"></div>

                            <p>
                                Finding items...
                            </p>

                        </div>

                    )}


                    {/* ===========================
                        ERROR
                    =========================== */}

                    {!loading && error && (

                        <div className="empty-search">

                            <FaSearch />

                            <h2>
                                Unable to load items
                            </h2>

                            <p>
                                {error}
                            </p>

                        </div>

                    )}


                    {/* ===========================
                        RESULTS
                    =========================== */}

                    {!loading &&
                        !error &&
                        filteredItems.length > 0 && (

                            <div className="results-grid">

                                {filteredItems.map((item) => {

                                    const imageUrl =
                                        getImageUrl(item);


                                    return (

                                        <motion.div
                                            key={item._id}
                                            className="result-card"
                                            initial={{
                                                opacity: 0,
                                                y: 20
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0
                                            }}
                                            whileHover={{
                                                y: -8
                                            }}
                                            transition={{
                                                duration: 0.25
                                            }}
                                        >


                                            {/* IMAGE */}

                                            {imageUrl ? (

                                                <img
                                                    src={imageUrl}
                                                    alt={item.title}
                                                />

                                            ) : (

                                                <div className="result-image-placeholder">

                                                    <FaSearch />

                                                    <span>
                                                        No image available
                                                    </span>

                                                </div>

                                            )}


                                            <div className="card-content">


                                                {/* STATUS */}

                                                <span
                                                    className={
                                                        item.type === "lost"
                                                            ? "lost-badge"
                                                            : "found-badge"
                                                    }
                                                >

                                                    {item.type === "lost"
                                                        ? "Lost"
                                                        : "Found"}

                                                </span>


                                                {/* TITLE */}

                                                <h3>
                                                    {item.title}
                                                </h3>


                                                {/* CATEGORY */}

                                                <p className="result-category">
                                                    {item.category}
                                                </p>


                                                {/* DESCRIPTION */}

                                                {item.description && (

                                                    <p className="result-description">

                                                        {item.description.length > 100
                                                            ? `${item.description.substring(0, 100)}...`
                                                            : item.description}

                                                    </p>

                                                )}


                                                {/* INFO */}

                                                <div className="card-info">

                                                    <span>

                                                        <FaMapMarkerAlt />

                                                        <span>
                                                            {item.location || "Unknown location"}
                                                        </span>

                                                    </span>


                                                    <span>

                                                        <FaCalendarAlt />

                                                        <span>
                                                            {formatDate(item)}
                                                        </span>

                                                    </span>

                                                </div>


                                                {/* DETAILS */}

                                                <button
                                                    className="details-btn"
                                                    onClick={() =>
                                                        handleViewDetails(item)
                                                    }
                                                    type="button"
                                                >

                                                    View Details

                                                </button>

                                            </div>

                                        </motion.div>

                                    );

                                })}

                            </div>

                        )}


                    {/* ===========================
                        EMPTY STATE
                    =========================== */}

                    {!loading &&
                        !error &&
                        filteredItems.length === 0 && (

                            <div className="empty-search">

                                <FaSearch />

                                <h2>
                                    No matching items found
                                </h2>

                                <p>
                                    Try a different keyword or adjust your filters.
                                </p>


                                {(query ||
                                    category !== "All Categories" ||
                                    type !== "All") && (

                                    <button
                                        className="clear-filters-btn empty-clear-btn"
                                        onClick={clearFilters}
                                        type="button"
                                    >

                                        <FaTimes />

                                        Clear Search & Filters

                                    </button>

                                )}

                            </div>

                        )}

                </div>

            </section>


            <Footer />

        </>
    );

}