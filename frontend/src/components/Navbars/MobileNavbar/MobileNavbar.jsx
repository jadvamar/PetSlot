import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import close from "/icons/close.png";

import css from "./MobileNavbar.module.css";
import { validateToken } from "../../Auth/ValidateToken";
import Login from "../../Auth/Login/Login";
import Signup from "../../Auth/Signup/Signup";
import SearchBar from "../../../utils/SearchBar/SearchBar";

let MobileNavbar = ({ toggleMenu, setToggleMenu }) => {
  let [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  let [auth, setAuth] = useState({
    closed: true,
    login: false,
    signup: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token"); // Fetch the token from localStorage
    if (token) {
      console.log(token);
      validateToken(token).then((email) => {
        if (email) {
          setLoggedIn(true);
          setUserEmail(email); // Set user email on successful validation
        } else {
          setLoggedIn(false);
        }
      });
    }
  }, []);

  return (
    <>
      <div className={css.mobileMenu}>
        <div className={css.menu}>
          <img
            className={css.menuBar}
            src={close}
            alt="menu bar"
            onClick={() => setToggleMenu((val) => !val)}
          />
          <Link className={css.title} to="/">
            PetSlot
          </Link>
        </div>
        <div className={css.navbar}>
          <SearchBar />
          <Link to="/add-restaurant" className={css.menuItem}>
            Add restaurant
          </Link>
          {loggedIn ? (
            <div className={css.menuItem}>
              <div className={css.profileName}>{userEmail}</div>
              {/* Render the profile picture or a placeholder */}
              <img
                src="/path/to/profile/picture.png"
                alt="Profile"
                className={css.profilePicture}
              />
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
      <div className={css.modals}>
        {auth.login ? (
          <Login setAuth={setAuth} setLoggedIn={setLoggedIn} />
        ) : null}
        {auth.signup ? <Signup setAuth={setAuth} /> : null}
      </div>
    </>
  );
};

export default MobileNavbar;
