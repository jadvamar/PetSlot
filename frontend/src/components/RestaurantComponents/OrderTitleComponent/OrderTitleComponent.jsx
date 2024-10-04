import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import css from "./OrderTitleComponent.module.css";
import RatingUtil from "../../../utils/RestaurantUtils/RatingUtil/RatingUtil";
import infoIcon from "/icons/info.png";
import DatePickerComponent from "./DatePicker";
import Cookies from "js-cookie";

const OrderTitleComponent = ({ shopData }) => {
  const [showDatePicker, setShowDatePicker] = useState(false); // To toggle the DatePicker visibility
  const [selectedSlots, setSelectedSlots] = useState([]);
  const { id } = useParams();
  // const [shopData, setShopData] = useState(null);

  // useEffect(() => {
  //   const fetchShopData = async () => {
  //     try {
  //       const token = Cookies.get("token"); // Example if you store a JWT token
  //       const numericId = parseInt(id, 10);

  //       const response = await fetch(
  //         `http://localhost:8085/api/v1/user/openShop?id=${id}`, // parse id as a number
  //         {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //             //Authorization: `Bearer ${token}`, // Add authorization header if needed
  //           },
  //         }
  //       );
  //       if (!response.ok) {
  //         console.log(id);
  //         throw new Error("Network response was not ok");
  //       }
  //       const data = await response.json();
  //       setShopData(data);
  //       console.log(data);
  //     } catch (error) {
  //       console.error("Failed to fetch shop data:", error);
  //     }
  //   };

  //   //fetchShopData();
  // }, [id]);

  const handleDateSelect = (date) => {
    // Handle the selected date (if needed)
    console.log("Selected Date: ", date);
  };

  const handleTimeSlotSelect = (slot) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== slot)); // Deselect if already selected
    } else {
      setSelectedSlots([...selectedSlots, slot]); // Select if not already selected
    }
  };

  return (
    <div className={css.outerDiv}>
      <div className={css.innerDiv}>
        <div className={css.left}>
          {/* Conditionally render shop data */}
          {shopData ? (
            <>
              <div className={css.title}>{shopData.name}</div>
              <div className={css.specials}>{shopData.phone}</div>
              <div className={css.address}>{shopData.address}</div>
              <div className={css.timings}>
                <span className={css.opORclo}>Opening Time -</span>
                <span className={css.time}>
                  {`${shopData.start} - ${shopData.end} (Today)`}
                </span>
                <span className={css.infoIconBox}>
                  <img
                    className={css.infoIcon}
                    src={infoIcon}
                    alt="info icon"
                  />
                  <div className={css.infoTooltip}>
                    <div className={css.ttil}>Opening Hours</div>
                    <div className={css.ttim}>
                      Mon-Sun:
                      <span
                        className={css.ctim}
                      >{`${shopData.start}-${shopData.end}`}</span>
                    </div>
                  </div>
                </span>
              </div>
            </>
          ) : (
            <div>Loading shop data...</div>
          )}

          {/* Button to show DatePicker */}
          <button
            className={css.orderButton}
            onClick={() => setShowDatePicker(true)} // Only show on click
          >
            Book Slot Now
          </button>

          {/* Conditionally render the DatePickerComponent */}
          {showDatePicker && (
            <DatePickerComponent
              onDateSelect={handleDateSelect}
              onTimeSlotSelect={handleTimeSlotSelect}
              selectedSlots={selectedSlots}
              startTimeFromBackend={shopData.start}
              endTimeFromBackend={shopData.end}
            />
          )}

          {selectedSlots.length > 0 && (
            <button className={css.paymentButton}>Proceed to Payment</button>
          )}
        </div>

        <div className={css.right}>
          <RatingUtil rating="4.1" count="601" txt="" />
        </div>
      </div>
    </div>
  );
};

export default OrderTitleComponent;
