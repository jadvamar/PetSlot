export const FetchShopData = async (token) => {
  try {
    const response = await fetch(
      "http://localhost:8085/api/v1/user/fetchData",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      console.log("Token validation success");
      const data = await response.json();
      const name = data.name;
      const description = data.description;
      const startTime = data.startTime;
      const endTime = data.endTime;
      const address = data.address;
      const phone = data.phone;
      const lat = data.lat;
      const logitude = data.logitude;
      const userId = data.userId;

      return {
        name,
        description,
        startTime,
        endTime,
        address,
        phone,
        lat,
        logitude,
        userId,
      };
    } else {
      throw new Error("data did not fetch");
    }
  } catch (error) {
    console.error("Error validating token:", error);
    return null; // Return null if validation fails
  }
};
