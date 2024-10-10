import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import { userInfo } from "../../Context/UserContext";
import "react-datepicker/dist/react-datepicker.css";
import css from "./ShopDashboard.module.css"; // Import your CSS file
import NavigationbarDashboard from "../../components/Navbars/DashboardNavigation/NavigationbarDashboard";
import Cookies from "js-cookie";

const ShopDashboard = () => {
  const [shop, setShop] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { user } = useContext(userInfo);

  useEffect(() => {
    if (user.id) {
      console.log(user.id);
      // Ensure the user ID is available
      fetchShopDetails();
      fetchBookingHistory(selectedDate);
    }
  }, [selectedDate, user.id]); // Fetch data when selectedDate changes

  const fetchShopDetails = async () => {
    // try {
    //   const response = await axios.get(
    //     `http://localhost:8085/api/v1/shops/${user.id}`
    //   );
    //   setShop(response.data);
    // } catch (error) {
    //   console.error("Error fetching shop details:", error);
    // }
  };

  const fetchBookingHistory = async (date) => {
    const formattedDate = date.toISOString().split("T")[0]; // Format date to YYYY-MM-DD
    try {
      const response = await axios.get(
        `http://localhost:8085/api/v1/user/getBookings?userid=${user.id}&date=${formattedDate}`
      );
      setBookings(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching booking history:", error);
    }
  };

  // Ensure you have this package to handle cookies

  const updateComplete = async (slotId) => {
    try {
      // Define the request body
      const requestBody = {
        id: slotId, // Assuming the backend expects an object with an 'id' field
      };

      // Make the API call
      const response = await axios.post(
        `http://localhost:8085/api/v1/user/makeComplete?id=${slotId}`, // API endpoint
        requestBody, // Pass the request body here
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`, // Use Cookies to get the token
          },
        }
      );

      if (response.status === 200) {
        console.log("Slot updated successfully:", response.data);
        // Optionally refresh bookings
        fetchBookingHistory(selectedDate);
      } else {
        console.error("Failed to update slot status:", response.data);
      }
    } catch (error) {
      console.error("Error updating booked slot:", error);
    }
  };

  const handleUpdateShopDetails = async () => {
    // Logic to update shop details (e.g., show a modal for updating)
    console.log("Update shop details functionality to be implemented");
  };

  return (
    <div className={css.shopDetailsContainer}>
      <NavigationbarDashboard />
      <h2>Booking History</h2>
      {/* <h2>{user.id}</h2> */}
      <div className={css.datePickerContainer}>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          className={css.inpBox}
        />
      </div>
      <table className={css.bookingTable}>
        <thead>
          <tr>
            <th>Sr.</th>
            <th>User Email</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr key={index}>
              <td>{index}</td>
              <td>{booking.userEmail}</td>
              <td>{booking.date.split("-").reverse().join("-")}</td>
              <td>{booking.startTime}</td>
              <td>{booking.endTime}</td>
              <th>
                {console.log("Completed : ", booking.completed)}
                {booking.completed === 2 ? ( // Check if Completed is 2
                  <span className={css.greenText}>Done</span> // Show "Done" text
                ) : (
                  <button
                    className={css.statusBtn}
                    onClick={() => updateComplete(booking.id)} // Show button for other statuses
                  >
                    Completed
                  </button>
                )}
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShopDashboard;
