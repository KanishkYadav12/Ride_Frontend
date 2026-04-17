import React, { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

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
        const response = await axios.get(`${API_BASE_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
      <div className="screen-base screen-user flex items-center justify-center">
        <div className="aurora-backdrop" />
        <div className="panel-card relative z-10 w-[min(92vw,420px)] p-8 text-center">
          <i className="ri-loader-4-line animate-spin text-6xl text-violet-600"></i>
          <p className="mt-4 text-lg font-medium text-slate-900">Loading...</p>
          <p className="mt-2 text-sm text-slate-600">
            Securing your trip dashboard.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default UserProtectWrapper;
