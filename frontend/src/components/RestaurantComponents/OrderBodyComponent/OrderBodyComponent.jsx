import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import css from "./OrderBodyComponent.module.css";

import OverviewFieldComponent from "./Components/OverviewFieldComponent/OverviewFieldComponent";
import MenuComponent from "./Components/MenuComponent/MenuComponent";
import ReviewsComponent from "./Components/ReviewsComponent/ReviewsComponent";
import PhotosComponent from "./Components/PhotosComponent/PhotosComponent";

const OrderBodyComponent = ({ shopData }) => {
  const { id, page = "overview" } = useParams(); // Capture the id and page from the URL
  const navigate = useNavigate();

  const [pageCompo, setPageComp] = useState(<OverviewFieldComponent />);

  const handleTabClick = (tab) => {
    console.log(`Navigating to: /order/${id}/${tab}`); // Debugging line
    navigate(`/order/${id}/${tab}`);
  };

  useEffect(() => {
    switch (page) {
      case "overview":
        setPageComp(<OverviewFieldComponent shopData={shopData} />);
        break;
      case "menu":
        setPageComp(<MenuComponent shopData={shopData} />);
        break;
      case "reviews":
        setPageComp(<ReviewsComponent shopData={shopData} />);
        break;
      case "photos":
        setPageComp(<PhotosComponent shopData={shopData} />);
        break;
      default:
        setPageComp(<OverviewFieldComponent shopData={shopData} />);
    }
  }, [page, shopData]); // Use shopData only for dependencies

  if (!shopData) {
    return <div>Loading...</div>; // or any loader you prefer
  }
  return (
    <div className={css.outerDiv}>
      <div className={css.innerDiv}>
        <div className={css.menu}>
          <a
            className={page === "overview" ? css.menuTxtActive : css.menuTxt}
            onClick={() => handleTabClick("overview")}
          >
            Overview
          </a>
          <a
            className={page === "menu" ? css.menuTxtActive : css.menuTxt}
            onClick={() => handleTabClick("menu")}
          >
            Service
          </a>
          <a
            className={page === "reviews" ? css.menuTxtActive : css.menuTxt}
            onClick={() => handleTabClick("reviews")}
          >
            Reviews
          </a>
          <a
            className={page === "photos" ? css.menuTxtActive : css.menuTxt}
            onClick={() => handleTabClick("photos")}
          >
            Photos
          </a>
        </div>
        <div className={css.componentsBody}>{pageCompo}</div>
      </div>
    </div>
  );
};

export default OrderBodyComponent;
