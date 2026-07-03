import "../components/browse/browse.css";

import Navbar from "../components/layout/navbar";
import Footer from "../components/footer/footer";
import BrowseCard from "../components/browse/browsecard";

import lostItems from "../components/latestlost/lostdata";
import foundItems from "../components/latestfound/founddata";

import { useParams } from "react-router-dom";
import { useState } from "react";

import { FaSearch } from "react-icons/fa";

export default function Browse() {

    const { type } = useParams();

    const items = type === "lost"
        ? lostItems
        : foundItems;

    const [search, setSearch] = useState("");

    const [category, setCategory] = useState("All");

    const categories = [

        "All",

        ...new Set(items.map(item => item.category))

    ];

    const filteredItems = items.filter(item => {

        const matchesSearch =

            item.title.toLowerCase().includes(search.toLowerCase()) ||

            item.location.toLowerCase().includes(search.toLowerCase());

        const matchesCategory =

            category === "All" ||

            item.category === category;

        return matchesSearch && matchesCategory;

    });

    return (

        <>

            <Navbar />

            <section className="browse-page">

                <div className="container">

                    <div className="browse-header">

                        <h1>

                            {

                                type === "lost"

                                ?

                                "Browse Lost Items"

                                :

                                "Browse Found Items"

                            }

                        </h1>

                        <p>

                            Search and filter items across campus.

                        </p>

                    </div>

                    <div className="browse-controls">

                        <div className="search-box">

                            <FaSearch />

                            <input

                                type="text"

                                placeholder="Search items..."

                                value={search}

                                onChange={(e)=>setSearch(e.target.value)}

                            />

                        </div>

                        <select

                            value={category}

                            onChange={(e)=>setCategory(e.target.value)}

                        >

                            {

                                categories.map(cat=>(

                                    <option

                                        key={cat}

                                    >

                                        {cat}

                                    </option>

                                ))

                            }

                        </select>

                    </div>
                    <p className="results-count">

    Showing <strong>{filteredItems.length}</strong> items

</p>
                    <div className="browse-grid">

                        {

                            filteredItems.map(item=>(

                                <BrowseCard

                                    key={item.id}

                                    item={item}

                                    type={type}

                                />

                            ))

                        }

                    </div>

                </div>

            </section>

            <Footer />

        </>

    );

}