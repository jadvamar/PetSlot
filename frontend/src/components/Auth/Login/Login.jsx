import { useState, useContext } from "react";
import { createPortal } from "react-dom";
import Cookies from "js-cookie";

import gLogo from "/images/google.png";
import closeBtn from "/images/closeBtn.jpg";

import loginCss from "./Login.module.css";

import { userInfo } from "../../../Context/UserContext";

let Login = ({
  setAuth,
  setLoggedIn,
  refreshNavigationBar,
  refreshNavigationBar2,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loginMessage, setLoginMessage] = useState("");
  const { user, setUser } = useContext(userInfo);

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!emailPattern.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await fetch(
          "http://localhost:8085/api/v1/user/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const token = data.token;
          const email = data.username;
          setUser({
            email: data.email,
          });

          // Store the token in a cookie (expires in 7 days)
          Cookies.set("token", token, { expires: 7 });
          Cookies.set("email", email, { expires: 7 });

          console.log("Login successful, token stored in cookie");
          setLoggedIn(true);
          setLoginMessage("Login successful!");

          setAuth({ closed: true, login: false, signup: false });

          // Refresh the NavigationBar after login
          refreshNavigationBar();
          //refreshNavigationBar2();
        } else {
          const errorData = await response.json();
          setLoginMessage(
            errorData.message || "Login failed. Please try again."
          );
        }
      } catch (error) {
        console.error("Login error:", error);
        setLoginMessage("An error occurred. Please try again.");
      }
    }
  };

  let loginDiv = (
    <div className={loginCss.outerDiv}>
      <div className={loginCss.modal}>
        <div className={loginCss.header}>
          <span className={loginCss.ttl}>Login</span>
          <span
            className={loginCss.closeBtn}
            onClick={() =>
              setAuth({ closed: true, login: false, signup: false })
            }
          >
            <img
              className={loginCss.closeBtnImg}
              src={closeBtn}
              alt="close button"
            />
          </span>
        </div>
        <form className={loginCss.lgBox} onSubmit={handleLogin}>
          <input
            className={loginCss.phoneInp}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <span className={loginCss.error}>{errors.email}</span>
          )}
          <input
            className={loginCss.phoneInp}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <span className={loginCss.error}>{errors.password}</span>
          )}
          <button className={loginCss.btn} type="submit">
            Log In
          </button>
          {loginMessage && (
            <span className={loginCss.loginMessage}>{loginMessage}</span>
          )}
        </form>
        <div className={loginCss.orBreak}>
          <span className={loginCss.orBreakText}>or</span>
        </div>
        <div className={loginCss.socialSignupBox}>
          <img className={loginCss.icon} src={gLogo} alt="google signup" />
          Continue with Google
        </div>
        <hr className={loginCss.break} />
        <div className={loginCss.newToZomato}>
          New to PetSlot?{" "}
          <div
            className={loginCss.createAcc}
            onClick={() =>
              setAuth({ closed: false, login: false, signup: true })
            }
          >
            Create Account
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(loginDiv, document.getElementById("modal"));
};

export default Login;
