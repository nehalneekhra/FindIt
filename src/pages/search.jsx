import "../components/search/search.css";

import Navbar from "../components/layout/navbar";
import Footer from "../components/footer/footer";

import { motion } from "framer-motion";
import { useState } from "react";

import {
  FaSearch,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaFilter,
} from "react-icons/fa";

export default function Search() {

  const [query, setQuery] = useState("");

  const items = [
    {
      id: 1,
      name: "Black Wallet",
      category: "Accessories",
      status: "Lost",
      location: "Library",
      date: "Today",
      image: "https://picsum.photos/400/250?random=1"
    },
    {
      id: 2,
      name: "Apple AirPods",
      category: "Electronics",
      status: "Found",
      location: "Cafeteria",
      date: "Yesterday",
      image: "https://picsum.photos/400/250?random=2"
    },
    {
      id: 3,
      name: "College ID Card",
      category: "Documents",
      status: "Lost",
      location: "Main Gate",
      date: "2 Days Ago",
      image: "https://picsum.photos/400/250?random=3"
    },
    {
      id: 4,
      name: "Blue Backpack",
      category: "Bags",
      status: "Found",
      location: "Computer Lab",
      date: "Today",
      image: "https://picsum.photos/400/250?random=4"
    },
    {
      id: 5,
      name: "Scientific Calculator",
      category: "Electronics",
      status: "Lost",
      location: "Block A",
      date: "Yesterday",
      image: "https://picsum.photos/400/250?random=5"
    },
    {
      id: 6,
      name: "Water Bottle",
      category: "Others",
      status: "Found",
      location: "Sports Ground",
      date: "Today",
      image: "https://picsum.photos/400/250?random=6"
    }
  ];

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <section className="search-page">

        <div className="container">

          <motion.div
            className="search-header"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
          >

            <h1>Search Lost & Found Items</h1>

            <p>
              Search across all reported lost and found items on campus.
            </p>

          </motion.div>

          <motion.div
            className="search-box-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: .2 }}
          >

            <div className="search-box">

              <FaSearch />

              <input
                type="text"
                placeholder="Search by item name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />

            </div>

          </motion.div>

          <div className="filter-row">

            <div className="filter">

              <FaFilter />

              <select>

                <option>All Categories</option>

                <option>Electronics</option>

                <option>Accessories</option>

                <option>Documents</option>

                <option>Bags</option>

                <option>Others</option>

              </select>

            </div>

            <div className="filter">

              <select>

                <option>Lost & Found</option>

                <option>Lost</option>

                <option>Found</option>

              </select>

            </div>

            <div className="filter">

              <select>

                <option>Newest First</option>

                <option>Oldest First</option>

              </select>

            </div>

          </div>

          <div className="results-grid">

            {filteredItems.length > 0 ? (

              filteredItems.map((item) => (

                <motion.div
                  key={item.id}
                  className="result-card"
                  whileHover={{ y: -8 }}
                >

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  <div className="card-content">

                    <span
                      className={
                        item.status === "Lost"
                          ? "lost-badge"
                          : "found-badge"
                      }
                    >
                      {item.status}
                    </span>

                    <h3>{item.name}</h3>

                    <p>{item.category}</p>

                    <div className="card-info">

                      <span>

                        <FaMapMarkerAlt />

                        {item.location}

                      </span>

                      <span>

                        <FaCalendarAlt />

                        {item.date}

                      </span>

                    </div>

                    <button className="details-btn">

                      View Details

                    </button>

                  </div>

                </motion.div>

              ))

            ) : (

              <div className="empty-search">

                <FaSearch />

                <h2>No matching items found</h2>

                <p>

                  Try another keyword.

                </p>

              </div>

            )}

          </div>

        </div>

      </section>

      <Footer />

    </>
  );

}