import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">

      <div className="blob blob1"></div>
      <div className="blob blob2"></div>
      <div className="overlay"></div>

      <motion.div
      className="hero-content"

      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{duration: 1
      }}
      >

        <div className="hero-badge">

        🎓 Trusted Across Campus

        </div>
        <h1>
          Every Lost Story
          <br />
          Deserves A Happy Ending.
        </h1>

        <p>
          Report lost items, discover found belongings,
          and help your community reconnect people with
          what matters.
        </p>

        <div className="hero-buttons">

          <Link to="/report-lost">
            <button className="lost-btn">
              Report Lost
            </button>
          </Link>

          <Link to="/report-found">
            <button className="found-btn">
              Report Found
            </button>
          </Link>

        </div>

      </motion.div>

    </section>
  );
}