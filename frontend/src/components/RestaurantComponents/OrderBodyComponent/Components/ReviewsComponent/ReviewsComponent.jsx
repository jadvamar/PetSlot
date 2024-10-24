import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RateYourExperienceCard from "../../../../../utils/Cards/RestaurantBodyCards/RateYourExperienceCard/RateYourExperienceCard";
import RestUserReviewedCard from "../../../../../utils/RestaurantUtils/RestUserReviewedCard/RestUserReviewedCard";
import css from "./ReviewsComponent.module.css";
import profilepic from "/images/profilepic.jpg";
import Cookies from "js-cookie"; // Make sure to import Cookies

const ReviewsComponent = () => {
  const { id } = useParams(); // Get the shop ID from the URL
  const [ratings, setRatings] = useState([]); // State to store fetched ratings
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const token = Cookies.get("token");
        const response = await fetch(
          `http://localhost:8085/api/v1/user/getRating?shopId=${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json(); // Fetch error data if the response is not ok
          throw new Error(`Error: ${errorData.message || response.statusText}`);
        }

        const data = await response.json();
        setRatings(data); // Update the state with fetched ratings
      } catch (error) {
        console.error("Failed to fetch ratings:", error);
        setError(error.message); // Set error state
      }
    };

    fetchRatings();
  }, [id]); // Trigger effect on 'id' change

  // Define the data to display in the reviews
  let data = ratings.map((rating) => ({
    imgSrc: profilepic, // You may want to replace this with a dynamic image if available
    name: rating.userName, // Assuming your API returns user name
    stars: rating.rate, // Assuming this is the correct field
    comment: rating.comment,
  }));

  return (
    <div className={css.outerDiv}>
      <div className={css.innerDiv}>
        <div className={css.left}>
          <div className={css.re}>
            {data.map((item, index) => (
              <RestUserReviewedCard key={index} data={item} /> // Use 'index' as key
            ))}
          </div>
        </div>
        <div className={css.right}>
          <RateYourExperienceCard />
        </div>
      </div>
    </div>
  );
};

export default ReviewsComponent;
