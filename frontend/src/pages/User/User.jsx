import React, { useEffect, useState } from "react";
import css from "./User.module.css";
import Navbar from "../../components/Navbars/NavigationBar2/NavigationBar2";
import { userInfo } from "../../Context/UserContext";
import { useContext } from "react";
import RateYourExperienceCard from "../../utils/Cards/RestaurantBodyCards/RateYourExperienceCard/RateYourExperienceCard";

const User = () => {
  const [userHistory, setUserHistory] = useState([]); // State to hold user history
  const [errorMessage, setErrorMessage] = useState(""); // State to hold error messages
  const { user } = useContext(userInfo);
  console.log("id: " + user.id);
  useEffect(() => {
    // Fetch user history only if user.id is available
    if (user && user.id) {
      const fetchUserHistory = async () => {
        try {
          const response = await fetch(
            `http://localhost:8085/api/v1/user/getHistory?userid=${user.id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch user history");
          }

          const data = await response.json();
          console.log(data);
          setUserHistory(data); // Store fetched data in state
        } catch (error) {
          setErrorMessage(error.message);
          console.error("Error fetching user history:", error);
        }
      };

      fetchUserHistory();
    } else {
      setErrorMessage("User ID not found.");
    }
  }, [user]); // Run only once on mount

  return (
    <div className={css.outerDiv}>
      <div className={css.navbar}>
        <Navbar />
      </div>
      <div className={css.box}>
        <div className={css.mainbody}>
          <h1>User History</h1>
          {errorMessage && (
            <div className={css.errorMessage}>{errorMessage}</div>
          )}
          {userHistory.length === 0 ? (
            <p>No history found.</p>
          ) : (
            <table className={css.historyTable}>
              <thead>
                <tr>
                  <th>Sr</th>
                  <th>Slot</th>
                  <th>Date</th>
                  <th>Shop</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {userHistory.map((historyItem, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{`${historyItem.startTime} - ${historyItem.endTime}`}</td>
                    <td>{historyItem.date.split("-").reverse().join("-")}</td>
                    <td>{historyItem.shopName}</td>
                    <th>
                      {historyItem.Completed == 1 ||
                      historyItem.Completed === null ? (
                        <span className={css.greenText}>Done</span>
                      ) : (
                        <span className={css.redText}>Pending</span>
                      )}
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default User;
