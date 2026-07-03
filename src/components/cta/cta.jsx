import "./cta.css";

import { motion } from "framer-motion";
import { FaArrowRight, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function cta() {
  return (
    <section className="cta">

      <div className="container">

        <motion.div
          className="cta-box"
          initial={{ opacity: 0, y: 70 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >

          <span className="cta-tag">
            Help Build a Better Campus
          </span>

          <h2>
            Ready To Reunite Someone With Their Belongings?
          </h2>

          <p>
            Whether you've misplaced an item or found something valuable,
            every report helps someone in the campus community.
          </p>

          <div className="cta-buttons">

            <Link to="/report-lost" className="cta-lost-btn">

              Report Lost

              <FaArrowRight />

            </Link>

            <Link to="/report-found" className="cta-found-btn">

              <FaSearch />

              Report Found

            </Link>

          </div>

        </motion.div>

      </div>

    </section>
  );
}