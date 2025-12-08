import React, { createContext, useState, useEffect } from "react";

export const UserDataContext = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState(() => {
    // ✅ Initialize from localStorage if available
    const savedUser = localStorage.getItem("user");
    return savedUser
      ? JSON.parse(savedUser)
      : {
          email: "",
          fullname: {
            firstname: "",
            lastname: "",
          },
        };
  });

  // ✅ Persist user to localStorage whenever it changes
  useEffect(() => {
    if (user?.email) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const value = {
    user,
    setUser,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContext;
