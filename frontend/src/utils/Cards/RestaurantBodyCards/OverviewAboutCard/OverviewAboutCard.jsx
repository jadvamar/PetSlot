import { useState } from "react";

import copyIcon from "/icons/copy.png";
import directioIcon from "/icons/direction.png";
import MapComponent from "../../../../components/Map/MapComponent";
import css from "./OverviewAboutCard.module.css";

import AlertBox from "../../../Alerts/AlertBox/AlertBox";
import BtnWithIcon from "../../../Buttons/BtnWithIcon/BtnWithIcon";

const OverviewAboutCard = ({ data }) => {
  // Check if data is valid before accessing its properties
  const phone = data?.phone || "N/A"; // Provide a fallback value if phone is undefined
  const address = data?.address || "Address not available";
  const lat = data?.lat ?? 0; // Check if data and lat are defined
  const lng = data?.lag ?? 0; // Check if data and lag are defined

  const [alert, setAlert] = useState({
    show: false,
  });

  // Alert timeout handling
  if (alert.show) {
    setTimeout(() => {
      setAlert({ show: false });
    }, 5000);
  }

  const handleDirectionClick = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(googleMapsUrl, "_blank"); // Open Google Maps in a new tab
  };

  const handleCopyClick = () => {
    setAlert({ show: true });
    navigator.clipboard.writeText(address); // Copy address to clipboard
  };

  return (
    <>
      <div className={css.outerDiv}>
        <div className={css.innerDiv}>
          <div className={css.header}>
            <div className={css.htxt}>Call</div>
            <div className={css.phone}>+91{phone}</div>
          </div>
          <div className={css.direction}>
            <div className={css.htxt}>Direction</div>
            <div className={css.map}>
              {lat !== 0 && lng !== 0 ? (
                <MapComponent
                  position={[lat, lng]} // Pass the lat/lng coordinates
                  setPosition={[lat, lng]}
                  setAddress={address}
                />
              ) : (
                <div>No map available</div>
              )}
            </div>
            <div className={css.addTxt}>{address}</div>
          </div>
          <div className={css.btns}>
            <BtnWithIcon icon={copyIcon} txt="Copy" onClick={handleCopyClick} />
            <BtnWithIcon
              icon={directioIcon}
              txt="Direction"
              onClick={handleDirectionClick}
            />
          </div>
        </div>
      </div>
      {alert.show && (
        <AlertBox
          text="Restaurant Address Copied to Clipboard"
          setClose={setAlert}
          stateVal="show"
        />
      )}
    </>
  );
};

export default OverviewAboutCard;
