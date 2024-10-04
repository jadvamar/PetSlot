export const validateToken = async (token) => {
  try {
    const response = await fetch(
      "http://localhost:8085/api/v1/user/validate-token",
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
      // const email = await response.text(); // Get email or user info from response
      // return email; // Return the email if token is valid

      const data = await response.json();
      const email = data.email;
      const role = data.role;
      return { email, role };
    } else {
      throw new Error("Token validation failed");
    }
  } catch (error) {
    console.error("Error validating token:", error);
    return null; // Return null if validation fails
  }
};
