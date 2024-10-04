import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { validateToken } from "../../Auth/ValidateToken";
import menuBar from "/icons/menu.png";
import downArrow from "/icons/down-arrow.png";
import profilePic from "/images/profilepic.jpg";
import Login from "../../Auth/Login/Login";
import SearchBar from "../../../utils/SearchBar/SearchBar";
import Signup from "../../Auth/Signup/Signup";
import css from "./NavigationBar2.module.css";
import Cookies from "js-cookie";

let NavigationBar = ({ toggleMenu, setToggleMenu, setShops }) => {
  let [menuDisplay, setMenuDisplay] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  //const [shops, setShops] = useState([]);
  let [loggedIn, setLoggedIn] = useState(localStorage.getItem("auth") || false);
  let [auth, setAuth] = useState({
    closed: true,
    login: false,
    signup: false,
  });

  const handleLocationSearch = async (location) => {
    try {
      const response = await fetch(
        `http://localhost:8085/api/v1/user/GetShops?location=${encodeURIComponent(
          location
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // setShops(data);
        setShops({
          shops: data,
          location: location, // Sending location along with shops
        });
        console.log(data); // Update the shops state in the parent component
      } else {
        setShops({ shops: [], location: location });
        console.error("shops did not fetched", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const logoutHandler = () => {
    setLoggedIn(false);
    Cookies.remove("token");
    localStorage.removeItem("auth");
    localStorage.removeItem("token");
  };

  const refreshNavigationBar2 = () => {
    const token = Cookies.get("token");
    if (token) {
      validateToken(token).then((data) => {
        if (data) {
          setLoggedIn(true);
          setUserEmail(data.email);
          setUserRole(data.role);
        } else {
          setLoggedIn(false);
        }
      });
    }
  };

  useEffect(() => {
    refreshNavigationBar2();
  }, []);

  return (
    <div className={css.navbar}>
      <img
        className={css.menuBar}
        src={menuBar}
        alt="menu bar"
        onClick={() => setToggleMenu((val) => !val)}
      />
      <div className={css.navbarInner}>
        <div className={css.leftSide}>
          <Link to="/" className={css.appTxt}>
            PetSlot
          </Link>
        </div>
        <div className={css.searchBar}>
          <SearchBar handleLocationSearch={handleLocationSearch} />
        </div>
        <div className={css.rightSide}>
          {loggedIn ? (
            <div className={css.menuItem}>
              <div
                className={css.profile}
                onClick={() => setMenuDisplay((val) => !val)}
              >
                <img
                  src={profilePic}
                  alt="profile pic"
                  className={css.profilePic}
                />
                <div className={css.profileName}>{userEmail}</div>
                <img src={downArrow} alt="arrow" className={css.arrow} />
              </div>
              <div
                className={css.menu}
                style={{ display: menuDisplay ? "block" : "" }}
              >
                <Link to="/user/ll/reviews" className={css.menuItemLinkTxt}>
                  <div className={css.menuItemLink}>Profile</div>
                </Link>
                <Link to="/user/ll/settings" className={css.menuItemLinkTxt}>
                  <div className={css.menuItemLink}>Settings</div>
                </Link>
                <div className={css.menuItemLinkTxt} onClick={logoutHandler}>
                  <div className={css.menuItemLink}>Logout</div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div
                className={css.menuItem}
                onClick={() =>
                  setAuth({ closed: false, login: true, signup: false })
                }
              >
                Log in
              </div>
              <div
                className={css.menuItem}
                onClick={() =>
                  setAuth({ closed: false, login: false, signup: true })
                }
              >
                Sign up
              </div>
            </>
          )}
        </div>
      </div>
      {/* Modals for Login/Signup */}
      <div className={css.modals}>
        {!auth.closed && auth.login && (
          <Login
            setAuth={setAuth}
            setLoggedIn={setLoggedIn}
            setUserEmail={setUserEmail} // Pass setUserEmail to update the email on login
          />
        )}
        {!auth.closed && auth.signup && <Signup setAuth={setAuth} />}
      </div>
    </div>
  );
};

export default NavigationBar;
