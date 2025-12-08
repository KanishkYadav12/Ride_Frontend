import React, { useContext, useEffect, useState } from "react";
import { CaptainDataContext } from "../context/CaptainContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/captains/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-500 to-emerald-600">
        <div className="text-center">
          <i className="text-6xl text-white ri-loader-4-line animate-spin"></i>
          <p className="mt-4 text-lg font-medium text-white">
            Verifying Captain...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default CaptainProtectWrapper;
