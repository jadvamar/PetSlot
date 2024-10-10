import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie"; // Ensure you have this import for handling cookies

import css from "./RestaurantPage.module.css";

import NavigationBar from "../../components/Navbars/NavigationBar2/NavigationBar2";
import HeroComponent from "../../components/RestaurantComponents/HeroComponent/HeroComponent";
import OrderTitleComponent from "../../components/RestaurantComponents/OrderTitleComponent/OrderTitleComponent";
import OrderBodyComponent from "../../components/RestaurantComponents/OrderBodyComponent/OrderBodyComponent";
import Footer from "../../components/Footer/Footer";

const RestaurantPage = () => {
  const { id } = useParams();
  const [shopData, setShopData] = useState(null);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const token = Cookies.get("token"); // Example if you store a JWT token
        const numericId = parseInt(id, 10);

        const response = await fetch(
          `http://localhost:8085/api/v1/user/openShop?id=${id}`, // Use numericId
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              //Authorization: `Bearer ${token}`, // Add authorization header if needed
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setShopData(data);
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch shop data:", error);
      }
    };

    fetchShopData();
  }, [id]);

  return (
    <div className={css.outerDiv}>
      <NavigationBar />
      <div className={css.innerDiv}>
        <div className={css.breadcrumb}>
          {shopData ? shopData.location : "Loading..."}
        </div>
      </div>
      <HeroComponent shopData={shopData} />
      <div className={css.innerDiv2}>
        <OrderTitleComponent shopData={shopData} />{" "}
        {/* Pass shopData to OrderTitleComponent */}
        <OrderBodyComponent shopData={shopData} id={id} />{" "}
        {/* Pass id to OrderBodyComponent */}
      </div>
      <Footer />
    </div>
  );
};

export default RestaurantPage;
