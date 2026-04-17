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
    <div className="screen-base screen-user flex items-center justify-center">
      <div className="aurora-backdrop" />
      <div className="panel-card relative z-10 w-[min(92vw,420px)] p-8 text-center">
        {isLoggingOut ? (
          <>
            <i className="ri-loader-4-line animate-spin text-6xl text-violet-600"></i>
            <p className="mt-4 text-xl font-semibold text-slate-900">
              Logging out...
            </p>
            <p className="mt-2 text-sm text-slate-600">
              We hope to see you again soon!
            </p>
          </>
        ) : (
          <>
            <i className="ri-checkbox-circle-line text-6xl text-emerald-600"></i>
            <p className="mt-4 text-xl font-semibold text-slate-900">
              Logged out successfully!
            </p>
            <p className="mt-2 text-sm text-slate-600">Redirecting...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default UserLogout;
