import React, { useState } from "react";
import { useParams } from "react-router-dom";
import css from "./OrderTitleComponent.module.css";
import RatingUtil from "../../../utils/RestaurantUtils/RatingUtil/RatingUtil";
import infoIcon from "/icons/info.png";
import DatePickerComponent from "./DatePicker";
import Cookies from "js-cookie";
import { validateToken } from "../../Auth/ValidateToken"; // Adjust the import path as necessary

const OrderTitleComponent = ({ shopData }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isUserValidated, setIsUserValidated] = useState(true);
  const { id } = useParams();
  const [unavailableBoxes, setUnavailableBoxes] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // State to hold error messages

  const handleDateSelect = async (date) => {
    setSelectedDate(date); // Save selected date
    console.log("Selected Date: ", date);

    // Call API to get unavailable boxes for the selected date and shop ID
    try {
      const response = await fetch(
        `http://localhost:8085/api/v1/user/${
          shopData.id
        }/unavailable-slots?date=${date.toISOString().split("T")[0]}`
      );

      if (response.ok) {
        const unavailableBoxIds = await response.json();
        setUnavailableBoxes(unavailableBoxIds);
        console.log("Unavailable Box IDs:", unavailableBoxIds);
      } else {
        setErrorMessage("Failed to fetch unavailable boxes.");
        console.error("Failed to fetch unavailable boxes", response.status);
      }
    } catch (error) {
      setErrorMessage("An error occurred while fetching unavailable boxes.");
      console.error("Error fetching unavailable boxes:", error);
    }
  };

  const handleTimeSlotSelect = (slot) => {
    setSelectedSlots([slot]); // Restrict to only one slot selection
  };

  // Function to call API to send booking data
  const bookSlot = async () => {
    if (selectedSlots.length === 0 || !selectedDate) {
      setErrorMessage("Please select a date and time slot.");
      console.error("Please select a date and time slot.");
      return;
    }

    const slot = selectedSlots[0]; // Assuming slot is an object with start and end
    const token = Cookies.get("token");
    const user = await validateToken(token); // Validate token and get user info
    if (!user) {
      setErrorMessage("Please login first. Booking cannot proceed.");
      console.error("Please login first, booking cannot proceed.");
      setIsUserValidated(false);
      return; // Exit if user is not validated
    } else {
      setIsUserValidated(true);
    }

    if (!slot || !slot.start || !slot.end) {
      setErrorMessage("Selected slot is invalid.");
      console.error("Selected slot is invalid.");
      return;
    }

    // Assuming slot is an object with start and end properties
    const formattedStartTime = slot.start;
    const formattedEndTime = slot.end;

    const bookingData = {
      shop: shopData.id,
      user: user.id, // Ensure this is a number
      date: selectedDate.toISOString().split("T")[0], // Format date as "YYYY-MM-DD"
      startTime: formattedStartTime, // Already in "HH:mm:ss" format
      endTime: formattedEndTime, // Already in "HH:mm:ss" format
    };

    console.log("Booking Data: ", bookingData);

    try {
      const response = await fetch(
        "http://localhost:8085/api/v1/user/book-slot",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bookingData), // Send booking data as JSON
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Slot booked successfully", result);
        // Redirect to payment or confirmation page
      } else {
        const error = await response.text();
        setErrorMessage(error || "Failed to book slot");
        console.error("Failed to book slot", response.status);
      }
    } catch (error) {
      setErrorMessage("An error occurred while booking the slot.");
      console.error("Error booking slot:", error);
    }
  };

  return (
    <div className={css.outerDiv}>
      <div className={css.innerDiv}>
        <div className={css.left}>
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
                      <span className={css.ctim}>
                        {`${shopData.start}-${shopData.end}`}
                      </span>
                    </div>
                  </div>
                </span>
              </div>
            </>
          ) : (
            <div>Loading shop data...</div>
          )}

          <button
            className={css.orderButton}
            onClick={() => setShowDatePicker(true)}
          >
            Book Slot Now
          </button>

          {showDatePicker && (
            <DatePickerComponent
              onDateSelect={handleDateSelect}
              onTimeSlotSelect={handleTimeSlotSelect}
              selectedSlots={selectedSlots}
              startTimeFromBackend={shopData.start}
              endTimeFromBackend={shopData.end}
              unavailableTimeRanges={unavailableBoxes}
            />
          )}

          {selectedSlots.length > 0 && (
            <>
              <button className={css.paymentButton} onClick={bookSlot}>
                Proceed to Payment
              </button>
              {!isUserValidated && (
                <div className={css.errorMessage}>
                  Please login to proceed with booking.
                </div>
              )}
            </>
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
