import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = ({ position, setPosition, setAddress }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Reverse Geocoding to fetch human-readable address
  const fetchAddress = (lat, lng) => {
    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && data.display_name) {
          setAddress(data.display_name);
        }
      })
      .catch((error) => {
        console.error("Error fetching location name:", error);
      });
  };

  useEffect(() => {
    // Initialize the map only once
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView(position, 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      // Add click event to the map to update position and fetch address
      mapRef.current.on("click", (e) => {
        const newPosition = [e.latlng.lat, e.latlng.lng];
        setPosition(newPosition);
        fetchAddress(e.latlng.lat, e.latlng.lng); // Fetch the address
      });
    }

    // Add or update marker on the map
    if (!markerRef.current) {
      markerRef.current = L.marker(position).addTo(mapRef.current);
    } else {
      markerRef.current.setLatLng(position);
    }

    // Update map center on position change
    mapRef.current.setView(position);

    // Cleanup map on component unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [position]); // Only re-run effect if position changes

  return <div id="map" style={{ height: "400px", width: "100%" }}></div>;
};

export default MapComponent;
