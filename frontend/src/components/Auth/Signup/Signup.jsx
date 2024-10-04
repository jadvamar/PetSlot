import { createPortal } from "react-dom";
import { useState } from "react";
import axios from "axios";
import gLogo from "/images/google.png";
import mailLogo from "/images/emailIcon.jpg";
import closeBtn from "/images/closeBtn.jpg";

import signupCss from "./Signup.module.css";

let Signup = ({ setAuth }) => {
  const [role, setRole] = useState("User");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState({}); // To store error messages
  const [message, setMessage] = useState(""); // For success or error messages

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!name) {
      newErrors.name = "Name is required.";
    }

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

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    // Terms validation
    if (!termsAccepted) {
      newErrors.terms = "You must accept the terms and conditions.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setMessage(""); // Clear previous messages
    if (validateForm()) {
      try {
        const response = await axios.post(
          "http://localhost:8085/api/v1/user/signup",
          {
            role,
            name,
            email,
            password,
          }
        );
        console.log("User registered:", response.data);
        setMessage("Registration successful!"); // Set success message
        // Optionally reset the form or redirect the user after successful signup
      } catch (error) {
        if (error.response) {
          // Check if the error is due to an existing user
          if (error.response.status === 401) {
            // If user already exists
            setErrors({ email: "User with this email already exists." });
            setMessage("User with this email already exists."); // Set error message
          } else {
            // Handle other errors
            console.error("Error:", error.response.data);
            alert(error.response.data); // Display error message to user
          }
        } else {
          console.error("Error:", error.message);
        }
      }
    }
  };

  let loginDiv = (
    <div className={signupCss.outerDiv}>
      <div className={signupCss.modal}>
        <div className={signupCss.header}>
          <span className={signupCss.ttl}>Signup</span>
          <span
            className={signupCss.closeBtn}
            onClick={() =>
              setAuth({ closed: true, login: false, signup: false })
            }
          >
            <img
              className={signupCss.closeBtnImg}
              src={closeBtn}
              alt="close button"
            />
          </span>
        </div>
        <form onSubmit={handleSubmit}>
          {" "}
          {/* Handle form submission */}
          <div className={signupCss.lgBox}>
            <input
              className={signupCss.inpBox}
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <span className={signupCss.error}>{errors.name}</span>
            )}

            <input
              className={signupCss.inpBox}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <span className={signupCss.error}>{errors.email}</span>
            )}

            <input
              className={signupCss.inpBox}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <span className={signupCss.error}>{errors.password}</span>
            )}

            <input
              className={signupCss.inpBox}
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && (
              <span className={signupCss.error}>{errors.confirmPassword}</span>
            )}

            <div className="radio-button-group">
              <input
                id="User"
                className={signupCss.inpBox}
                type="radio"
                name="role"
                value="User"
                checked={role === "User"}
                onChange={() => setRole("User")}
              />
              <label htmlFor="User">User</label>
              <input
                id="Company"
                className={signupCss.inpBox}
                type="radio"
                name="role"
                value="Company"
                checked={role === "Company"}
                onChange={() => setRole("Company")}
              />
              <label htmlFor="Company">Company</label>
            </div>
            <br></br>

            <span className={signupCss.termsTxt}>
              <input
                type="checkbox"
                name="accept"
                id="accept"
                className={signupCss.checkBox}
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)} // Toggle checkbox
              />
              <span>
                I agree to Zomato's{" "}
                <a href="" className={signupCss.termaAnchor}>
                  Terms of Service, Privacy Policy
                </a>{" "}
                and{" "}
                <a href="" className={signupCss.termaAnchor}>
                  Content Policies
                </a>
              </span>
            </span>
            {errors.terms && (
              <span className={signupCss.error}>{errors.terms}</span>
            )}

            <button className={signupCss.btn} type="submit">
              Create Account
            </button>

            {/* Display success or error messages here */}
            {message && <span className={signupCss.message}>{message}</span>}
          </div>
          <div className={signupCss.orBreak}>
            <span className={signupCss.orBreakText}>or</span>
          </div>
          <div className={signupCss.socialSignupBox}>
            <img className={signupCss.icon} src={gLogo} alt="google login" />
            Continue with Google
          </div>
          <hr className={signupCss.break} />
          <div className={signupCss.newToZomato}>
            Already have an account?{" "}
            <div
              className={signupCss.createAcc}
              onClick={() =>
                setAuth({ closed: false, login: true, signup: false })
              }
            >
              Log in
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(loginDiv, document.getElementById("modal"));
};

export default Signup;
