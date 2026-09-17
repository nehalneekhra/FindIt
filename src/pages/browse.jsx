import "../components/browse/browse.css";

import Navbar from "../components/layout/navbar";
import Footer from "../components/footer/footer";
import BrowseCard from "../components/browse/browsecard";

import { getAllItems } from "../services/itemService";

import { useEffect, useMemo, useState } from "react";

import {
    FaSearch,
    FaFilter,
    FaTimes,
    FaSortAmountDown
} from "react-icons/fa";

import { useSearchParams } from "react-router-dom";


export default function Browse() {

    const [items, setItems] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [searchParams, setSearchParams] =
        useSearchParams();


    /*
     * =========================
     * FILTER STATE
     * =========================
     */

    const [search, setSearch] = useState(
        searchParams.get("q") || ""
    );

    const [type, setType] = useState(
        searchParams.get("type") || "all"
    );

    const [category, setCategory] = useState(
        searchParams.get("category") || "all"
    );

    const [location, setLocation] = useState(
        searchParams.get("location") || "all"
    );

    const [status, setStatus] = useState(
        searchParams.get("status") || "all"
    );

    const [sort, setSort] = useState(
        searchParams.get("sort") || "newest"
    );


    /*
     * =========================
     * FETCH ITEMS
     * =========================
     */

    useEffect(() => {

        const fetchItems = async () => {

            setLoading(true);

            setError("");

            try {

                const response =
                    await getAllItems();


                if (response.success) {

                    setItems(
                        response.items || []
                    );

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
                    "Unable to load items."
                );

            } finally {

                setLoading(false);

            }

        };


        fetchItems();

    }, []);


    /*
     * =========================
     * KEEP URL IN SYNC
     * =========================
     */

    useEffect(() => {

        const params = {};


        if (search.trim()) {
            params.q = search.trim();
        }

        if (type !== "all") {
            params.type = type;
        }

        if (category !== "all") {
            params.category = category;
        }

        if (location !== "all") {
            params.location = location;
        }

        if (status !== "all") {
            params.status = status;
        }

        if (sort !== "newest") {
            params.sort = sort;
        }


        setSearchParams(params, {
            replace: true
        });

    }, [
        search,
        type,
        category,
        location,
        status,
        sort,
        setSearchParams
    ]);


    /*
     * =========================
     * CATEGORY LIST
     * =========================
     */

    const categories = useMemo(() => {

        const uniqueCategories =
            new Set();

        items.forEach(item => {

            if (item.category) {

                uniqueCategories.add(
                    item.category
                );

            }

        });


        return [
            "all",
            ...Array.from(uniqueCategories)
                .sort((a, b) =>
                    a.localeCompare(b)
                )
        ];

    }, [items]);


    /*
     * =========================
     * LOCATION LIST
     * =========================
     */

    const locations = useMemo(() => {

        const uniqueLocations =
            new Set();

        items.forEach(item => {

            if (item.location) {

                uniqueLocations.add(
                    item.location
                );

            }

        });


        return [
            "all",
            ...Array.from(uniqueLocations)
                .sort((a, b) =>
                    a.localeCompare(b)
                )
        ];

    }, [items]);


    /*
     * =========================
     * FILTER + SORT
     * =========================
     */

    const filteredItems = useMemo(() => {

        const searchText =
            search.trim().toLowerCase();


        const result =
            items.filter(item => {

                /*
                 * SEARCH
                 */

                const title =
                    item.title?.toLowerCase() || "";

                const description =
                    item.description?.toLowerCase() || "";

                const itemLocation =
                    item.location?.toLowerCase() || "";

                const itemCategory =
                    item.category?.toLowerCase() || "";


                const matchesSearch =
                    !searchText ||
                    title.includes(searchText) ||
                    description.includes(searchText) ||
                    itemLocation.includes(searchText) ||
                    itemCategory.includes(searchText);


                /*
                 * TYPE
                 */

                const matchesType =
                    type === "all" ||
                    item.type === type;


                /*
                 * CATEGORY
                 */

                const matchesCategory =
                    category === "all" ||
                    item.category === category;


                /*
                 * LOCATION
                 */

                const matchesLocation =
                    location === "all" ||
                    item.location === location;


                /*
                 * STATUS
                 */

                const itemStatus =
                    item.status || "active";


                const matchesStatus =
                    status === "all" ||
                    (
                        status === "active" &&
                        itemStatus !== "claimed"
                    ) ||
                    (
                        status === "claimed" &&
                        itemStatus === "claimed"
                    );


                return (
                    matchesSearch &&
                    matchesType &&
                    matchesCategory &&
                    matchesLocation &&
                    matchesStatus
                );

            });


        /*
         * SORT
         */

        result.sort((a, b) => {

            const dateA =
                new Date(a.createdAt || 0)
                    .getTime();

            const dateB =
                new Date(b.createdAt || 0)
                    .getTime();


            if (sort === "oldest") {

                return dateA - dateB;

            }


            return dateB - dateA;

        });


        return result;

    }, [
        items,
        search,
        type,
        category,
        location,
        status,
        sort
    ]);


    /*
     * =========================
     * CLEAR FILTERS
     * =========================
     */

    const clearFilters = () => {

        setSearch("");

        setType("all");

        setCategory("all");

        setLocation("all");

        setStatus("all");

        setSort("newest");

    };


    /*
     * =========================
     * CHECK ACTIVE FILTERS
     * =========================
     */

    const hasActiveFilters =
        search.trim() !== "" ||
        type !== "all" ||
        category !== "all" ||
        location !== "all" ||
        status !== "all" ||
        sort !== "newest";


    return (

        <>

            <Navbar />


            <section className="browse-page">

                <div className="container">


                    {/* =========================
                        HEADER
                    ========================= */}

                    <div className="browse-header">

                        <h1>
                            Browse Items
                        </h1>

                        <p>
                            Search and discover lost and found
                            items across campus.
                        </p>

                    </div>


                    {/* =========================
                        CONTROLS
                    ========================= */}

                    <div className="browse-controls">


                        {/* SEARCH */}

                        <div className="search-box">

                            <FaSearch />

                            <input
                                type="text"
                                placeholder="Search by item, description, location..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                            {search && (

                                <button
                                    className="clear-search-btn"
                                    onClick={() =>
                                        setSearch("")
                                    }
                                    aria-label="Clear search"
                                    type="button"
                                >

                                    <FaTimes />

                                </button>

                            )}

                        </div>


                        {/* TYPE */}

                        <div className="filter-group">

                            <FaFilter />

                            <select
                                value={type}
                                onChange={(e) =>
                                    setType(e.target.value)
                                }
                            >

                                <option value="all">
                                    All Items
                                </option>

                                <option value="lost">
                                    Lost Items
                                </option>

                                <option value="found">
                                    Found Items
                                </option>

                            </select>

                        </div>


                        {/* CATEGORY */}

                        <div className="filter-group">

                            <select
                                value={category}
                                onChange={(e) =>
                                    setCategory(e.target.value)
                                }
                            >

                                <option value="all">
                                    All Categories
                                </option>

                                {categories
                                    .filter(cat =>
                                        cat !== "all"
                                    )
                                    .map(cat => (

                                        <option
                                            key={cat}
                                            value={cat}
                                        >
                                            {cat}
                                        </option>

                                    ))
                                }

                            </select>

                        </div>


                        {/* LOCATION */}

                        <div className="filter-group">

                            <select
                                value={location}
                                onChange={(e) =>
                                    setLocation(e.target.value)
                                }
                            >

                                <option value="all">
                                    All Locations
                                </option>

                                {locations
                                    .filter(loc =>
                                        loc !== "all"
                                    )
                                    .map(loc => (

                                        <option
                                            key={loc}
                                            value={loc}
                                        >
                                            {loc}
                                        </option>

                                    ))
                                }

                            </select>

                        </div>


                        {/* STATUS */}

                        <div className="filter-group">

                            <select
                                value={status}
                                onChange={(e) =>
                                    setStatus(e.target.value)
                                }
                            >

                                <option value="all">
                                    All Status
                                </option>

                                <option value="active">
                                    Active
                                </option>

                                <option value="claimed">
                                    Claimed
                                </option>

                            </select>

                        </div>


                        {/* SORT */}

                        <div className="filter-group sort-filter">

                            <FaSortAmountDown />

                            <select
                                value={sort}
                                onChange={(e) =>
                                    setSort(e.target.value)
                                }
                            >

                                <option value="newest">
                                    Newest First
                                </option>

                                <option value="oldest">
                                    Oldest First
                                </option>

                            </select>

                        </div>

                    </div>


                    {/* =========================
                        ACTIVE FILTER BAR
                    ========================= */}

                    {hasActiveFilters && (

                        <div className="active-filters">

                            <div>

                                <FaFilter />

                                <span>
                                    Filters applied
                                </span>

                            </div>


                            <button
                                type="button"
                                onClick={clearFilters}
                            >

                                Clear all

                                <FaTimes />

                            </button>

                        </div>

                    )}


                    {/* =========================
                        RESULT COUNT
                    ========================= */}

                    {!loading && !error && (

                        <div className="results-header">

                            <p className="results-count">

                                Showing{" "}

                                <strong>
                                    {filteredItems.length}
                                </strong>{" "}

                                {filteredItems.length === 1
                                    ? "item"
                                    : "items"
                                }

                            </p>


                            {items.length !==
                                filteredItems.length && (

                                <span className="results-total">

                                    {items.length} total items

                                </span>

                            )}

                        </div>

                    )}


                    {/* =========================
                        LOADING
                    ========================= */}

                    {loading && (

                        <div className="browse-message">

                            <div className="browse-spinner"></div>

                            <p>
                                Loading items...
                            </p>

                        </div>

                    )}


                    {/* =========================
                        ERROR
                    ========================= */}

                    {!loading && error && (

                        <div className="browse-message error">

                            <p>
                                {error}
                            </p>

                        </div>

                    )}


                    {/* =========================
                        ITEMS
                    ========================= */}

                    {!loading &&
                        !error &&
                        filteredItems.length > 0 && (

                            <div className="browse-grid">

                                {filteredItems.map(item => (

                                    <BrowseCard
                                        key={`${item.type}-${item._id}`}
                                        item={item}
                                        type={item.type}
                                    />

                                ))}

                            </div>

                        )
                    }


                    {/* =========================
                        NO RESULTS
                    ========================= */}

                    {!loading &&
                        !error &&
                        filteredItems.length === 0 && (

                            <div className="browse-empty">

                                <div className="browse-empty-icon">

                                    <FaSearch />

                                </div>

                                <h3>
                                    No items found
                                </h3>

                                <p>
                                    Try changing your search
                                    or removing some filters.
                                </p>

                                {hasActiveFilters && (

                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                    >
                                        Clear Filters
                                    </button>

                                )}

                            </div>

                        )
                    }


                </div>

            </section>


            <Footer />

        </>

    );

}