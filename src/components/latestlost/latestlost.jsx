import "./latestlost.css";
import lostItems from "./lostdata";

import { useState } from "react";

import { motion } from "framer-motion";

import ItemModal from "../modal/itemmodal";

import {
  FaHeart,
  FaRegHeart,
  FaMapMarkerAlt,
  FaClock,
  FaArrowRight
} from "react-icons/fa";

export default function LatestLost() {

  const [selectedItem, setSelectedItem] = useState(null);

  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (id) => {

    if (favorites.includes(id)) {

      setFavorites(favorites.filter((item) => item !== id));

    } else {

      setFavorites([...favorites, id]);

    }

  };

  return (

    <section className="latest-lost">

      <div className="container">

        {/* Header */}

        <motion.div

          className="lost-section-header"

          initial={{ opacity: 0, y: 40 }}

          whileInView={{ opacity: 1, y: 0 }}

          transition={{ duration: .7 }}

          viewport={{ once: true }}

        >

          <span className="section-tag red">

            Recently Reported

          </span>

          <h2>

            Latest Lost Items

          </h2>

          <p>

            Browse the most recently reported lost belongings
            across your campus.

          </p>

        </motion.div>

        {/* Cards */}

        <div className="lost-grid">

          {

            lostItems.map((item, index) => (

              <motion.div

                key={item.id}

                className="lost-card"

                initial={{ opacity: 0, y: 50 }}

                whileInView={{ opacity: 1, y: 0 }}

                transition={{ delay: index * .15 }}

                viewport={{ once: true }}

                whileHover={{ y: -10 }}

                onClick={() => setSelectedItem(item)}

              >

                <div className="image-box">

                  <img

                    src={item.image}

                    alt={item.title}

                  />

                  <button

                    className="favorite-btn lost"

                    onClick={(e) => {

                      e.stopPropagation();

                      toggleFavorite(item.id);

                    }}

                  >

                    {

                      favorites.includes(item.id)

                        ?

                        <FaHeart />

                        :

                        <FaRegHeart />

                    }

                  </button>

                  <span className="lost-status">

                    LOST

                  </span>

                </div>

                <div className="lost-content">

                  <h3>

                    {item.title}

                  </h3>

                  <div className="info">

                    <span>

                      <FaMapMarkerAlt />

                      {item.location}

                    </span>

                    <span>

                      <FaClock />

                      {item.time}

                    </span>

                  </div>

                  <div className="lost-category">

                    {item.category}

                  </div>

                  <button

                    onClick={(e) => {

                      e.stopPropagation();

                      setSelectedItem(item);

                    }}

                  >

                    View Details

                    <FaArrowRight />

                  </button>

                </div>

              </motion.div>

            ))

          }

        </div>

        {/* View All */}

        <motion.div

          className="view-all-container"

          initial={{ opacity: 0, y: 30 }}

          whileInView={{ opacity: 1, y: 0 }}

          transition={{ duration: .6 }}

          viewport={{ once: true }}

        >

          <button className="view-all-lost-btn">

            View All Lost Items

            <FaArrowRight />

          </button>

        </motion.div>

      </div>

      {/* Modal */}

      <ItemModal

        item={selectedItem}

        onClose={() => setSelectedItem(null)}

      />

    </section>

  );

}