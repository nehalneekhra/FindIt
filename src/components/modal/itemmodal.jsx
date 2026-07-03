import "./itemmodal.css";

import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaMapMarkerAlt,
  FaClock,
  FaUser,
  FaTag
} from "react-icons/fa";

export default function ItemModal({ item, onClose }) {

  if (!item) return null;

  return (

    <AnimatePresence>

      <motion.div

        className="modal-overlay"

        initial={{ opacity: 0 }}

        animate={{ opacity: 1 }}

        exit={{ opacity: 0 }}

        onClick={onClose}

      >

        <motion.div

          className="modal-box"

          initial={{ scale: .85, opacity: 0 }}

          animate={{ scale: 1, opacity: 1 }}

          exit={{ scale: .85, opacity: 0 }}

          transition={{ duration: .3 }}

          onClick={(e) => e.stopPropagation()}

        >

          <button

            className="close-btn"

            onClick={onClose}

          >

            <FaTimes />

          </button>

          <motion.img

    src={item.image}

    alt={item.title}

    className="modal-image"

    initial={{scale:1.1}}

    animate={{scale:1}}

    transition={{duration:.6}}

/>

          <div className="modal-content">

            <h2>

              {item.title}

            </h2>

            <div className="modal-info">

              <span>

                <FaMapMarkerAlt />

                {item.location}

              </span>

              {

                item.time ? (

                  <span>

                    <FaClock />

                    {item.time}

                  </span>

                ) : (

                  <span>

                    <FaUser />

                    {item.finder}

                  </span>

                )

              }

              <span>

                <FaTag />

                {item.category}

              </span>

            </div>

            <p className="modal-description">

              {

                item.description ||

                "No description available for this item."

              }

            </p>

            <button className="claim-btn">

              {

                item.time

                ?

                "Claim This Item"

                :

                "Contact Finder"

              }

            </button>

          </div>

        </motion.div>

      </motion.div>

    </AnimatePresence>

  );

}