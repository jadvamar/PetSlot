import { createContext, useState } from "react";

// Create UserContext
export const userInfo = createContext();

// Create UserProvider to wrap your application and provide user data
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: null,
    email: "",
    role: "",
  });

  return (
    <userInfo.Provider value={{ user, setUser }}>{children}</userInfo.Provider>
  );
};
