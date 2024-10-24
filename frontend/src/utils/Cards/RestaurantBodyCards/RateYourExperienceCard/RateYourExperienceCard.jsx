import { useContext, useState } from "react";
import { Formik, Form, Field } from "formik";
import { useParams } from "react-router-dom"; // Import useParams
import css from "./RateYourExperienceCard.module.css";
import RatingNumberBox from "../../../RestaurantUtils/RatingNumberBox/RatingNumberBox";
import { userInfo } from "../../../../Context/UserContext";
import Cookies from "js-cookie";
const RateYourExperienceCard = () => {
  const [stars, setStars] = useState(0);
  const { user } = useContext(userInfo);
  const [review, setReview] = useState("");
  const [quots] = useState([
    "",
    "Horrible",
    "Bad",
    "Average",
    "Good",
    "Excellent",
  ]);

  const { id } = useParams(); // Get shopId from URL

  const initialValues = {
    review: "",
  };

  // API call to send rating data
  const handleSubmit = async (values) => {
    const ratingData = {
      userId: user.id,
      shopId: id, // Use the shopId from the URL
      rate: stars,
      comment: values.review,
    };

    try {
      console.log(ratingData);
      const Token = Cookies.get("token");
      const response = await fetch("http://localhost:8085/api/v1/user/rating", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
        body: JSON.stringify(ratingData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Review Submitted:", data);
        // You can display a success message or update UI here
      } else {
        console.error("Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className={css.outerDiv}>
      <div className={css.innerDiv}>
        <div className={css.ttl}>Rate your experience for</div>

        {/* Rating Stars */}
        <div className={css.ratingBox}>
          {[1, 2, 3, 4, 5].map((num) => (
            <RatingNumberBox
              key={num}
              stars={stars}
              txt={num.toString()}
              iconR={stars > num}
              isActive={stars >= num}
              onClick={() => setStars(num)}
            />
          ))}
          <div className={css.ratingTxt}>{quots[stars]}</div>
        </div>

        <Formik
          initialValues={initialValues}
          onSubmit={(values) => handleSubmit({ ...values, rating: stars })}
        >
          {({ handleChange }) => (
            <Form className={css.form}>
              {/* Textarea for Review */}
              <div className={css.modalTxt}>Write a Review</div>
              <Field
                as="textarea"
                name="review"
                className={css.reviewBox}
                placeholder="Write your review here..."
                value={review}
                onChange={(e) => {
                  handleChange(e);
                  setReview(e.target.value);
                }}
              />

              {/* Submit Button */}
              <button type="submit" className={css.submitBtn}>
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RateYourExperienceCard;
