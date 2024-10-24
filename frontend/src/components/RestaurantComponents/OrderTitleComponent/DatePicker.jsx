import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import css from "./DatePicker.module.css";

const DatePickerComponent = ({
  onDateSelect,
  onTimeSlotSelect,
  selectedSlots,
  startTimeFromBackend, // "HH:MM:SS" format string
  endTimeFromBackend,
  unavailableTimeRanges = [], // Default to an empty array to avoid undefined
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(null); // Track the selected slot index

  // Helper function to format time in AM/PM format
  const formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // If hours is 0, set to 12 (midnight or noon)
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return hours + ":" + minutes + " " + ampm;
  };

  const formatToHHMM = (timeString) => {
    if (!timeString) {
      console.error("Invalid timeString:", timeString);
      return ""; // Return an empty string or a default value if timeString is invalid
    }
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  };

  // Function to check if a given slot is unavailable by comparing start times
  const isSlotUnavailable = (slotStartTime) => {
    const slotStart = formatToHHMM(slotStartTime); // Converts "HH:MM:SS" to "HH:MM"

    console.log("slotStartTime : ", slotStartTime);
    console.log("slotStart : ", slotStart);
    console.log("unavailableTimeRanges : ", unavailableTimeRanges);
    return unavailableTimeRanges.some((range) => {
      const rangeStart = formatToHHMM(range.startTime); // Ensure ranges are in "HH:MM"
      const rangeEnd = formatToHHMM(range.endTime);
      console.log("unavailable : ", rangeStart, rangeEnd);
      if (!rangeStart || !rangeEnd) {
        console.error("Invalid time range:", range);
        return false;
      }

      return slotStart >= rangeStart && slotStart < rangeEnd;
    });
  };

  // Function to generate hourly time slots between start and end time
  const generateHourlySlots = (startTime, endTime) => {
    // Check for valid input
    if (!startTime || !endTime) {
      console.error("Invalid startTime or endTime:", startTime, endTime);
      return []; // Return an empty array if invalid
    }

    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);

    // Ensure dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.error("Invalid Date created from startTime and endTime");
      return []; // Return an empty array if invalid dates
    }

    const slots = [];
    let currentTime = new Date(start);
    currentTime.setMinutes(0);
    currentTime.setSeconds(0);

    // Loop to generate the time slots
    while (currentTime < end) {
      let nextTime = new Date(currentTime);
      nextTime.setHours(currentTime.getHours() + 1);

      slots.push({
        start: currentTime.toTimeString().split(" ")[0], // "HH:MM:SS"
        end: nextTime.toTimeString().split(" ")[0], // "HH:MM:SS"
        label: `${formatAMPM(currentTime)} - ${formatAMPM(nextTime)}`,
      });
      currentTime.setHours(currentTime.getHours() + 1);
    }

    return slots;
  };

  useEffect(() => {
    // Generate time slots when startTime or endTime changes
    const slots = generateHourlySlots(startTimeFromBackend, endTimeFromBackend);
    // console.log(slots);
    setTimeSlots(slots);
  }, [startTimeFromBackend, endTimeFromBackend]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  // Handle single slot selection
  const handleTimeSlotSelect = (slot, index) => {
    if (!isSlotUnavailable(slot.start)) {
      // Only select the slot if it's not unavailable
      setSelectedSlotIndex(index); // Update the selected slot index
      onTimeSlotSelect(slot); // Pass the selected slot to the parent
    }
  };

  return (
    <div>
      <div className={css.calendarDiv}>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          minDate={new Date()}
          dateFormat="MMMM d, yyyy"
          placeholderText="Select a date"
          className={css.datePicker}
        />
      </div>

      {selectedDate && (
        <div className={css.timeSlotsContainer}>
          <h4>Select Time Slot:</h4>
          <div className={css.timeSlots}>
            {timeSlots.map((slot, index) => {
              const isUnavailable = isSlotUnavailable(slot.start); // Check if slot is unavailable
              return (
                <div
                  key={index}
                  className={`${css.timeSlot} ${
                    selectedSlotIndex === index ? css.selected : ""
                  } ${isUnavailable ? css.unavailable : ""}`} // Add unavailable class conditionally
                  onClick={() => {
                    if (!isUnavailable) {
                      // Prevent selection of unavailable slots
                      handleTimeSlotSelect(slot, index);
                    }
                  }}
                  style={{
                    cursor: isUnavailable ? "not-allowed" : "pointer", // Disable cursor for unavailable slots
                    backgroundColor: isUnavailable ? "grey" : "", // Change background color for unavailable slots
                    color: isUnavailable ? "white" : "", // Change text color for unavailable slots
                  }}
                >
                  {slot.label}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePickerComponent;
