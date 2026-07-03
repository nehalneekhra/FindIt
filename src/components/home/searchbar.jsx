import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
  return (
    <div className="search-container">
      <div className="search-box">
        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search lost or found items..."
        />

        <button>
          Search
        </button>
      </div>
    </div>
  );
}