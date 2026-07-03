import "./latestfound.css";
import foundItems from "./founddata";

import { useState } from "react";

import { motion } from "framer-motion";

import ItemModal from "../modal/itemmodal";

import {
  FaHeart,
  FaRegHeart,
  FaMapMarkerAlt,
  FaUser,
  FaArrowRight
} from "react-icons/fa";

export default function LatestFound() {

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

    <section className="latest-found">

      <div className="container">

        {/* Header */}

        <motion.div

          className="found-section-header"

          initial={{ opacity: 0, y: 40 }}

          whileInView={{ opacity: 1, y: 0 }}

          transition={{ duration: .7 }}

          viewport={{ once: true }}

        >

          <span className="section-tag green">

            Recently Found

          </span>

          <h2>

            Latest Found Items

          </h2>

          <p>

            Browse the latest items reported by students
            waiting to be claimed.

          </p>

        </motion.div>

        {/* Cards */}

        <div className="found-grid">

          {

            foundItems.map((item,index)=>(

              <motion.div

                key={item.id}

                className="found-card"

                initial={{opacity:0,y:50}}

                whileInView={{opacity:1,y:0}}

                transition={{delay:index*.15}}

                viewport={{once:true}}

                whileHover={{y:-10}}

                onClick={()=>setSelectedItem(item)}

              >

                <div className="image-box">

                  <img

                    src={item.image}

                    alt={item.title}

                  />

                  <button

                    className="favorite-btn found"

                    onClick={(e)=>{

                      e.stopPropagation();

                      toggleFavorite(item.id);

                    }}

                  >

                    {

                      favorites.includes(item.id)

                      ?

                      <FaHeart/>

                      :

                      <FaRegHeart/>

                    }

                  </button>

                  <span className="found-status">

                    FOUND

                  </span>

                </div>

                <div className="found-content">

                  <h3>

                    {item.title}

                  </h3>

                  <div className="info">

                    <span>

                      <FaMapMarkerAlt/>

                      {item.location}

                    </span>

                    <span>

                      <FaUser/>

                      {item.finder}

                    </span>

                  </div>

                  <div className="found-category">

                    {item.category}

                  </div>

                  <button

                    onClick={(e)=>{

                      e.stopPropagation();

                      setSelectedItem(item);

                    }}

                  >

                    Contact Finder

                    <FaArrowRight/>

                  </button>

                </div>

              </motion.div>

            ))

          }

        </div>

        {/* View All */}

        <motion.div

          className="view-all-container"

          initial={{opacity:0,y:30}}

          whileInView={{opacity:1,y:0}}

          transition={{duration:.6}}

          viewport={{once:true}}

        >

          <button className="view-all-found-btn">

            View All Found Items

            <FaArrowRight/>

          </button>

        </motion.div>

      </div>

      <ItemModal

        item={selectedItem}

        onClose={()=>setSelectedItem(null)}

      />

    </section>

  );

}