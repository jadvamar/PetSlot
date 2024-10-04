import React from "react";
import css from "./MenuComponent.module.css";

const MenuComponent = ({ setData, shopData }) => {
  // Add shopData here
  // Extract services from shopData
  const services = shopData?.services || []; // Ensure services is an array

  return (
    <div className={css.outerDiv}>
      <div className={css.ttl}>Services We Provide</div>
      {services.length > 0 ? (
        <ol className={css.menuList}>
          {services.map((service, index) => (
            <li key={index} className={css.menuItem}>
              {service} {/* Assuming services are strings */}
            </li>
          ))}
        </ol>
      ) : (
        <p>No services available.</p> // Handle case when there are no services
      )}
    </div>
  );
};

export default MenuComponent;
