import "./footer.css";

import { Link } from "react-router-dom";

import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaSearch
} from "react-icons/fa";

export default function Footer() {
  return (

    <footer className="footer">

      <div className="container">

        <div className="footer-grid">

          {/* Brand */}

          <div className="footer-brand">

            <div className="footer-logo">

              <FaSearch />

              <span>Find<span className="purple">It</span></span>

            </div>

            <p>

              Helping students reconnect with what matters most.
              Report lost belongings, return found items and build
              a stronger campus community.

            </p>

          </div>

          {/* Quick Links */}

          <div>

            <h4>Quick Links</h4>

            <ul>

              <li><Link to="/">Home</Link></li>

              <li><Link to="/browse">Browse</Link></li>

              <li><Link to="/report-lost">Report Lost</Link></li>

              <li><Link to="/report-found">Report Found</Link></li>

            </ul>

          </div>

          {/* Resources */}

          <div>

            <h4>Resources</h4>

            <ul>

              <li><a href="#">Privacy Policy</a></li>

              <li><a href="#">Terms & Conditions</a></li>

              <li><a href="#">Help Center</a></li>

              <li><a href="#">FAQs</a></li>

            </ul>

          </div>

          {/* Contact */}

          <div>

            <h4>Connect</h4>

            <div className="social-icons">

              <a href="#">
                <FaGithub />
              </a>

              <a href="#">
                <FaLinkedin />
              </a>

              <a href="#">
                <FaEnvelope />
              </a>

            </div>

          </div>

        </div>

        <div className="footer-bottom">

          <p>

            © 2026 FindIt. Made with ❤️ by Nehal.

          </p>

        </div>

      </div>

    </footer>

  );
}