import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/CaptainContext";
import { API_BASE_URL } from "../config/api";

const CaptainLogout = () => {
  const navigate = useNavigate();
  const { setCaptain } = useContext(CaptainDataContext);
  const [isLoggingOut, setIsLoggingOut] = useState(true);

  useEffect(() => {
    const performLogout = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/captain-login");
        return;
      }

      try {
        await axios.get(`${API_BASE_URL}/captains/logout`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Clear captain data
        setCaptain(null);

        // Clear token
        localStorage.removeItem("token");

        // Redirect after short delay
        setTimeout(() => {
          navigate("/captain-login");
        }, 1500);
      } catch (err) {
        console.error("Logout error:", err);
        // Even if API fails, clear local data
        localStorage.removeItem("token");
        navigate("/captain-login");
      } finally {
        setIsLoggingOut(false);
      }
    };

    performLogout();
  }, [navigate, setCaptain]);

  return (
    <div className="screen-base screen-captain flex items-center justify-center">
      <div className="aurora-backdrop" />
      <div className="panel-card relative z-10 w-[min(92vw,420px)] p-8 text-center">
        {isLoggingOut ? (
          <>
            <i className="ri-loader-4-line animate-spin text-6xl text-emerald-600"></i>
            <p className="mt-4 text-xl font-semibold text-slate-900">
              Logging out...
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Thank you for your service!
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

export default CaptainLogout;
