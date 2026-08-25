import "../components/browse/browse.css";

import Navbar from "../components/layout/navbar";
import Footer from "../components/footer/footer";
import BrowseCard from "../components/browse/browsecard";

import { getAllItems } from "../services/itemService";

import { useEffect, useState } from "react";

import { FaSearch } from "react-icons/fa";


export default function Browse() {

    const [items, setItems] = useState([]);

    const [search, setSearch] = useState("");

    const [category, setCategory] = useState("All");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    /*
     * Fetch ALL lost and found items
     */

    useEffect(() => {

        const fetchItems = async () => {

            setLoading(true);

            setError("");

            setCategory("All");


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
                    "Unable to load items."
                );

            } finally {

                setLoading(false);

            }

        };


        fetchItems();

    }, []);


    /*
     * Create category list
     */

    const categories = [
        "All",
        ...new Set(
            items
                .map(item => item.category)
                .filter(Boolean)
        )
    ];


    /*
     * Search + category filtering
     */

    const filteredItems = items.filter(item => {

        const title =
            item.title?.toLowerCase() || "";


        const location =
            item.location?.toLowerCase() || "";


        const searchText =
            search.toLowerCase();


        const matchesSearch =
            title.includes(searchText) ||
            location.includes(searchText);


        const matchesCategory =
            category === "All" ||
            item.category === category;


        return (
            matchesSearch &&
            matchesCategory
        );

    });


    return (

        <>

            <Navbar />


            <section className="browse-page">

                <div className="container">


                    {/* HEADER */}

                    <div className="browse-header">

                        <h1>
                            Browse Items
                        </h1>

                        <p>
                            Search and discover lost and found items across campus.
                        </p>

                    </div>


                    {/* SEARCH + FILTER */}

                    <div className="browse-controls">


                        <div className="search-box">

                            <FaSearch />

                            <input

                                type="text"

                                placeholder="Search items..."

                                value={search}

                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }

                            />

                        </div>


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


                    {/* LOADING */}

                    {loading && (

                        <p className="results-count">

                            Loading items...

                        </p>

                    )}


                    {/* ERROR */}

                    {!loading && error && (

                        <p className="results-count">

                            {error}

                        </p>

                    )}


                    {/* RESULT COUNT */}

                    {!loading && !error && (

                        <p className="results-count">

                            Showing{" "}

                            <strong>
                                {filteredItems.length}
                            </strong>{" "}

                            items

                        </p>

                    )}


                    {/* ITEMS */}

                    <div className="browse-grid">

                        {!loading &&
                            !error &&
                            filteredItems.map(item => (

                                <BrowseCard

                                    key={item._id}

                                    item={item}

                                    type={item.type}

                                />

                            ))

                        }

                    </div>


                    {/* NO RESULTS */}

                    {!loading &&
                        !error &&
                        filteredItems.length === 0 && (

                            <p className="results-count">

                                No items found.

                            </p>

                        )

                    }


                </div>

            </section>


            <Footer />

        </>

    );

}