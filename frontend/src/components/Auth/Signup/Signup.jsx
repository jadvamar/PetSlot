import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
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
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

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
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (validateForm()) {
      try {
        const response = await axios.post(
          "http://localhost:8085/api/v1/user/signup",
          { role, name, email, password }
        );
        console.log("User registered:", response.data);
        setMessage("Registration successful!");
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setErrors({ email: "User with this email already exists." });
          setMessage("User with this email already exists.");
        } else {
          console.error("Error:", error.response ? error.response.data : error);
        }
      }
    }
  };

  const handleGoogleSignup = () => {
    google.accounts.id.initialize({
      client_id:
        "51593724276-h3djp2kbqho92b1en6jhov0v2glgni24.apps.googleusercontent.com", // Replace with your client ID
      callback: async (response) => {
        const id_token = response.credential;
        try {
          const serverResponse = await axios.post(
            "http://localhost:8085/api/v1/user/google-signup",
            { token: id_token, role }
          );
          console.log("Google Signup Response:", serverResponse.data);
          setMessage("Signup successful!");
          setAuth({ token: serverResponse.data.token });
        } catch (error) {
          console.error("Error during Google signup:", error);
          alert("Google signup failed.");
        }
      },
    });

    google.accounts.id.prompt(); // Show the one-tap prompt
  };

  useEffect(() => {
    // Load the Google script only when the component mounts
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

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
            <br />

            <span className={signupCss.termsTxt}>
              <input
                type="checkbox"
                name="accept"
                id="accept"
                className={signupCss.checkBox}
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
              />
              <span>
                I agree to PetSlot's{" "}
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

            {message && <span className={signupCss.message}>{message}</span>}
          </div>

          <div className={signupCss.orBreak}>
            <span className={signupCss.orBreakText}>or</span>
          </div>
          <div
            className={signupCss.socialSignupBox}
            onClick={handleGoogleSignup}
          >
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
