import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { validateToken } from "../../Auth/ValidateToken";
import MapComponent from "../../Map/MapComponent"; // Import the map component
import signupCss from "./AddRestraurentForm.module.css"; // Your existing CSS
import closeBtn from "/images/closeBtn.jpg"; // Close button image
import { Link } from "react-router-dom";
const PetServiceSignup = ({ setAuth }) => {
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("auth") || false
  );
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState(""); // Update address dynamically from map click
  const [phoneNumber, setPhoneNumber] = useState("");
  const [openTime, setOpenTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [photos, setPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  // Location state
  const [position, setPosition] = useState([51.505, -0.09]); // Default position

  const [selectedServiceTypes, setSelectedServiceTypes] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  const petOptions = [
    "Dog",
    "Cat",
    "Hamster",
    "Horse",
    "Cow",
    "Buffalo",
    "Sheep",
  ];
  const serviceOptions = [
    "Bathing",
    "Haircut",
    "Nail Trimming",
    "Vaccination",
    "Health Check-up",
    "Training Session",
  ];

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setPhotos((prevPhotos) => [...prevPhotos, ...files]);
  };

  const handleRemovePhoto = (index) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
  };

  const handleServiceTypeChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue !== "" && !selectedServiceTypes.includes(selectedValue)) {
      setSelectedServiceTypes([...selectedServiceTypes, selectedValue]);
    }
  };

  const handleServiceChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue !== "" && !selectedServices.includes(selectedValue)) {
      setSelectedServices([...selectedServices, selectedValue]);
    }
  };

  const removeServiceType = (indexToRemove) => {
    setSelectedServiceTypes((prevServiceTypes) =>
      prevServiceTypes.filter((_, index) => index !== indexToRemove)
    );
  };

  const removeService = (indexToRemove) => {
    setSelectedServices((prevServices) =>
      prevServices.filter((_, index) => index !== indexToRemove)
    );
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      validateToken(token).then((data) => {
        if (data) {
          setLoggedIn(true);
          Cookies.set("email", data.email);
        } else {
          setLoggedIn(false);
        }
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");

    const formData = new FormData();
    formData.append("companyName", companyName);
    formData.append("description", description);
    formData.append("address", address);
    formData.append("phoneNumber", phoneNumber);
    formData.append("openTime", openTime);
    formData.append("endTime", endTime);

    formData.append("latitude", position[0]);
    formData.append("longitude", position[1]);
    formData.append("email", Cookies.get("email"));

    selectedServiceTypes.forEach((serviceType) => {
      formData.append("selectedServiceTypes[]", serviceType);
    });

    selectedServices.forEach((service) => {
      formData.append("selectedServices[]", service);
    });

    photos.forEach((photo) => {
      formData.append("photos", photo);
    });
    console.log(
      companyName,
      description,
      address,
      phoneNumber,
      openTime,
      endTime,
      position[0],
      position[1],
      Cookies.get("email"),
      selectedServiceTypes,
      selectedServices,
      photos
    );

    try {
      const response = await axios.post(
        "http://localhost:8085/api/v1/user/Shop",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Service added successfully!");
    } catch (error) {
      setMessage("You have already registered a shop.");
    }
  };

  const modalRoot = document.getElementById("modal");
  if (!modalRoot) return null;

  return createPortal(
    <div className={signupCss.outerDiv}>
      <div className={signupCss.modal}>
        <div className={signupCss.header}>
          <span className={signupCss.ttl}>Add Pet Service</span>
          <span
            className={signupCss.closeBtn}
            onClick={() =>
              setAuth({ closed: true, login: false, signup: false })
            }
          >
            <Link to="/">
              {" "}
              {/* Wrap the content with Link component */}
              <img
                className={signupCss.closeBtnImg}
                src={closeBtn}
                alt="close button"
              />
            </Link>
          </span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={signupCss.lgBox}>
            <input
              className={signupCss.inpBox}
              type="text"
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
            <input
              className={signupCss.inpBox}
              type="text"
              placeholder="Select Address from Map"
              value={address}
              readOnly // Address will be updated from map click
            />
            <div className={signupCss.mapContainer}>
              <MapComponent
                position={position}
                setPosition={setPosition}
                setAddress={setAddress}
              />
            </div>
            <input
              className={signupCss.inpBox}
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <input
              className={signupCss.inpBox}
              type="time"
              placeholder="Open Time"
              value={openTime}
              onChange={(e) => setOpenTime(e.target.value)}
            />
            <input
              className={signupCss.inpBox}
              type="time"
              placeholder="End Time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />

            {/* Pet types dropdown */}
            <label htmlFor="petTypes">Pet Types:</label>
            <select
              id="petTypes"
              value=""
              onChange={handleServiceTypeChange}
              className={signupCss.inpBox}
            >
              <option value="">--Select Pet Types--</option>
              {petOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className={signupCss.selectedList}>
              {selectedServiceTypes.map((type, index) => (
                <span key={index} className={signupCss.selectedItem}>
                  {type}{" "}
                  <button onClick={() => removeServiceType(index)}>x</button>
                </span>
              ))}
            </div>

            {/* Services dropdown */}
            <label htmlFor="services">Services you Provide:</label>
            <select
              id="services"
              value=""
              onChange={handleServiceChange}
              className={signupCss.inpBox}
            >
              <option value="">--Select Services--</option>
              {serviceOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className={signupCss.selectedList}>
              {selectedServices.map((service, index) => (
                <span key={index} className={signupCss.selectedItem}>
                  {service}{" "}
                  <button onClick={() => removeService(index)}>x</button>
                </span>
              ))}
            </div>

            {/* Description */}
            <textarea
              className={signupCss.inpBox}
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            {/* Photo uploads */}
            <label htmlFor="photos">Upload Photos:</label>
            <input
              type="file"
              id="photos"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className={signupCss.inpBox}
            />
            <div className={signupCss.photoPreview}>
              {photos.map((photo, index) => (
                <div key={index} className={signupCss.photoContainer}>
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Uploaded ${index}`}
                    className={signupCss.photoThumb}
                  />
                  <button onClick={() => handleRemovePhoto(index)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button type="submit" className={signupCss.btn}>
              Add Service
            </button>
            {message && <p>{message}</p>}
          </div>
        </form>
      </div>
    </div>,
    modalRoot
  );
};

export default PetServiceSignup;
