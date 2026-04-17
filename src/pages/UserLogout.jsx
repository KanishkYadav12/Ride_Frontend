import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";
import { API_BASE_URL } from "../config/api";

const UserLogout = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);
  const [isLoggingOut, setIsLoggingOut] = useState(true);

  useEffect(() => {
    const performLogout = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        await axios.get(`${API_BASE_URL}/users/logout`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Clear user data
        setUser({
          email: "",
          fullname: {
            firstname: "",
            lastname: "",
          },
        });

        // Clear token
        localStorage.removeItem("token");

        // Redirect after short delay
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } catch (err) {
        console.error("Logout error:", err);
        // Even if API fails, clear local data
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setIsLoggingOut(false);
      }
    };

    performLogout();
  }, [navigate, setUser]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-500 to-blue-600">
      <div className="text-center">
        {isLoggingOut ? (
          <>
            <i className="text-6xl text-white ri-loader-4-line animate-spin"></i>
            <p className="mt-4 text-xl font-semibold text-white">
              Logging out...
            </p>
            <p className="mt-2 text-sm text-white opacity-75">
              We hope to see you again soon!
            </p>
          </>
        ) : (
          <>
            <i className="text-6xl text-white ri-checkbox-circle-line"></i>
            <p className="mt-4 text-xl font-semibold text-white">
              Logged out successfully!
            </p>
            <p className="mt-2 text-sm text-white opacity-75">Redirecting...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default UserLogout;
