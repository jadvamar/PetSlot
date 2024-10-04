import { useState } from "react";
import Navbar from "../../Navbars/NavigationBar/NavigationBar";
import MobileNavbar from "../../Navbars/MobileNavbar/MobileNavbar";
import SearchBar from "../../../utils/SearchBar/SearchBar";

import css from "./HomePageBanner.module.css";
import banner from "/banners/banner1.jpg";

let HomePageBanner = () => {
  let [toogleMenu, setToggleMenu] = useState(true);
  const [shops, setShops] = useState([]); // State to hold the shops data

  // Define the handleLocationSearch function
  const handleLocationSearch = async (location) => {
    try {
      const response = await fetch(
        `http://localhost:8085/api/v1/user/GetShops?location=${encodeURIComponent(
          location
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setShops({
          shops: data,
          location: location, // Sending location along with shops
        });
        console.log(data); // Update the shops state
      } else {
        setShops({ shops: [], location: location });
        console.error("shops did not fetched", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  let toggleBanner = toogleMenu ? (
    <div className={css.banner}>
      <Navbar setToggleMenu={setToggleMenu} toogleMenu={toogleMenu} />
      <div className={css.bannerInner}>
        <img src={banner} alt="banner" className={css.bannerImg} />
        <div className={css.bannerTxt}>
          <div className={css.title}>PetSlot</div>
          <div className={css.tag}>
            Healthy Pets, Happy Hearts: Book Your Grooming Slot Today!
          </div>
          <div className={css.searchbar}>
            <SearchBar handleLocationSearch={handleLocationSearch} />{" "}
            {/* Pass the function here */}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <MobileNavbar setToggleMenu={setToggleMenu} toogleMenu={toogleMenu} />
  );

  return toggleBanner;
};

export default HomePageBanner;
