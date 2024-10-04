import { useState, useEffect, useRef } from "react";
import css from "./SearchBar.module.css";
import downArrow from "/icons/down-arrow1.png";
import locationIcon from "/icons/location.png";
import { useNavigate } from "react-router-dom";

import { orderOnlinePage } from "../../helpers/constants";
const SearchBar = ({ handleLocationSearch }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Close the dropdown if clicked outside
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // List of locations for the dropdown
  const locations = [
    "New York",
    "Los Angeles",
    "Chicago",
    "London",
    "Houston",
    "Phoenix",
    "San Francisco",
    "Miami",
    "Atlanta",
    "Seattle",
    "Boston",
    "Denver",
    "Las Vegas",
    "Orlando",
    "Dallas",
    "San Diego",
    "Philadelphia",
    "Austin",
    "San Antonio",
    "Nashville",
    "Detroit",
    "San Jose",
    "Washington, D.C.",
    "Mumbai",
    "Pune",
    "Nashik",
    "Banglore",
  ];

  // Handle input change and filter locations
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value) {
      const filtered = locations.filter((location) =>
        location.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLocations(filtered);
      setDropdownVisible(true);
      setHighlightedIndex(-1); // Reset highlighted index when user types
    } else {
      setDropdownVisible(false);
    }
  };

  const handleLocationClick = (location) => {
    setInputValue(location); // Set clicked location in the input field
    setDropdownVisible(false); // Hide dropdown after selection
    setHighlightedIndex(-1); // Reset highlight
    handleLocationSearch(location);
    navigate("/show-case?page=" + orderOnlinePage); // Trigger location search with selected location
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      // Move down in the dropdown list
      setHighlightedIndex((prevIndex) =>
        prevIndex < filteredLocations.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      // Move up in the dropdown list
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : filteredLocations.length - 1
      );
    } else if (e.key === "Enter") {
      // Select the highlighted location or first location if none is highlighted
      if (highlightedIndex === -1 && filteredLocations.length > 0) {
        handleLocationClick(filteredLocations[0]);
      } else if (
        highlightedIndex >= 0 &&
        highlightedIndex < filteredLocations.length
      ) {
        handleLocationClick(filteredLocations[highlightedIndex]);
      }
    }
  };

  return (
    <div className={css.outerDiv} ref={searchRef}>
      <div className={css.srch1}>
        <div className={css.iconBox}>
          <img className={css.icon} src={locationIcon} alt="location pointer" />
        </div>
        <input
          type="text"
          placeholder="Place.."
          className={css.inpt}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setDropdownVisible(true)} // Show dropdown on focus
          onKeyDown={handleKeyDown} // Keyboard navigation
        />
        <div className={css.iconBox}>
          <img className={css.downArrow} src={downArrow} alt="down arrow" />
        </div>
      </div>

      {isDropdownVisible && (
        <div className={css.dropdownBox}>
          {filteredLocations.length > 0 ? (
            filteredLocations.map((location, index) => (
              <div
                key={index}
                className={`${css.dropdownItem} ${
                  highlightedIndex === index ? css.highlighted : ""
                }`}
                onClick={() => handleLocationClick(location)}
              >
                {location}
              </div>
            ))
          ) : (
            <div className={css.dropdownItem}>No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
