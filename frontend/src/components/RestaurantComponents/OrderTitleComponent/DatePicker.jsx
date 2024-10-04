import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import css from "./DatePicker.module.css";

const DatePickerComponent = ({
  onDateSelect,
  onTimeSlotSelect,
  selectedSlots,
  startTimeFromBackend, // "HH:MM:SS" format string
  endTimeFromBackend, // "HH:MM:SS" format string
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);

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

  // Function to generate hourly time slots between start and end time
  const generateHourlySlots = (startTime, endTime) => {
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    const slots = [];

    let currentTime = new Date(start);
    currentTime.setMinutes(0);
    currentTime.setSeconds(0);

    // Loop to generate the time slots
    while (currentTime < end) {
      let nextTime = new Date(currentTime);
      nextTime.setHours(currentTime.getHours() + 1);

      slots.push(`${formatAMPM(currentTime)} - ${formatAMPM(nextTime)}`);
      currentTime.setHours(currentTime.getHours() + 1);
    }

    return slots;
  };

  useEffect(() => {
    // Generate time slots when startTime or endTime changes
    const slots = generateHourlySlots(startTimeFromBackend, endTimeFromBackend);
    setTimeSlots(slots);
  }, [startTimeFromBackend, endTimeFromBackend]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onDateSelect(date);
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
          <h4>Select Time Slots:</h4>
          <div className={css.timeSlots}>
            {timeSlots.map((slot, index) => (
              <div
                key={index}
                className={`${css.timeSlot} ${
                  selectedSlots.includes(slot) ? css.selected : ""
                }`}
                onClick={() => onTimeSlotSelect(slot)}
              >
                {slot}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePickerComponent;
