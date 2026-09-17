import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

export default function SearchBar() {

    const navigate = useNavigate();

    const [search, setSearch] = useState("");


    const handleSearch = (e) => {

        e.preventDefault();

        const trimmedSearch = search.trim();

        if (!trimmedSearch) {
            navigate("/browse");
            return;
        }

        navigate(
            `/browse?search=${encodeURIComponent(trimmedSearch)}`
        );

    };


    return (

        <div className="search-container">

            <form
                className="search-box"
                onSubmit={handleSearch}
            >

                <FaSearch className="search-icon" />

                <input
                    type="text"
                    placeholder="Search lost or found items..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                <button type="submit">
                    Search
                </button>

            </form>

        </div>

    );

}