import React, { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserProtectWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setUser(response.data);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Auth error:", err);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    verifyToken();
  }, [token, navigate, setUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-500 to-blue-600">
        <div className="text-center">
          <i className="text-6xl text-white ri-loader-4-line animate-spin"></i>
          <p className="mt-4 text-lg font-medium text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default UserProtectWrapper;
