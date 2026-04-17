import React, { useContext, useEffect, useState } from "react";
import { CaptainDataContext } from "../context/CaptainContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

const CaptainProtectWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { setCaptain } = useContext(CaptainDataContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/captain-login");
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/captains/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setCaptain(response.data.captain);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Auth error:", err);
        localStorage.removeItem("token");
        navigate("/captain-login");
      }
    };

    verifyToken();
  }, [token, navigate, setCaptain]);

  if (isLoading) {
    return (
      <div className="screen-base screen-captain flex items-center justify-center">
        <div className="aurora-backdrop" />
        <div className="panel-card relative z-10 w-[min(92vw,420px)] p-8 text-center">
          <i className="ri-loader-4-line animate-spin text-6xl text-emerald-600"></i>
          <p className="mt-4 text-lg font-medium text-slate-900">
            Verifying Captain...
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Preparing your captain dashboard.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default CaptainProtectWrapper;
