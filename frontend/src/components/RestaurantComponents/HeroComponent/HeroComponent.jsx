import React, { useState, useEffect } from "react";
import css from "./HeroComponent.module.css";
import { useParams } from "react-router-dom";
import GalleryImgCard from "../../../utils/Cards/RestaurantHeroCards/GalleryImgCard/GalleryImgCard";
import AddPhotosCard from "../../../utils/Cards/RestaurantHeroCards/AddPhotosCard/AddPhotosCard";
import ViewGalleryImgCard from "../../../utils/Cards/RestaurantHeroCards/ViewGalleryImgCard/ViewGalleryImgCard";

const HeroComponent = ({ shopData }) => {
  const { id } = useParams(); // Get the shop ID from the URL parameters
  const [headerImage, setHeaderImage] = useState(null); // State to hold the header image
  const [loading, setLoading] = useState(true); // Loading state

  // Check if the shopData contains the image
  useEffect(() => {
    if (shopData && shopData.image) {
      setHeaderImage(shopData.image); // Directly set the image from shopData if available
      setLoading(false); // Stop loading once the image is set
    }
  }, [shopData]);

  // Fetch the image from the backend if not in shopData
  useEffect(() => {
    if (!shopData || !shopData.image) {
      const fetchHeaderImage = async () => {
        try {
          const response = await fetch(
            `http://localhost:8085/api/v1/user/getHeaderImage?id=${id}`, // Fetch header image from API
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();

          // Assuming your data has a property 'photo' that contains the Base64 image string
          if (data.photo) {
            setHeaderImage(data.photo); // Set the Base64 string directly
          }

          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch header image:", error);
          setLoading(false);
        }
      };

      fetchHeaderImage();
    }
  }, [id, shopData]);

  return (
    <div className={css.outerDiv}>
      <div className={css.innerDiv}>
        <div className={css.scr1}>
          {loading ? (
            <div>Loading header image...</div>
          ) : (
            headerImage && (
              <>
                <GalleryImgCard
                  imgSrc={`data:image/jpeg;base64,${headerImage}`} // Display the fetched image
                />
              </>
            )
          )}
        </div>
        <div className={css.scr2}>
          {/* Render additional gallery images or components */}
          {/* <AddPhotosCard />
          <ViewGalleryImgCard imgSrc={headerImage} />{" "} */}
          {/* Optional to show as view card */}
        </div>
      </div>
    </div>
  );
};

export default HeroComponent;
