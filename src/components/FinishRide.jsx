import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

const FinishRide = (props) => {
  const navigate = useNavigate();
  const [isEnding, setIsEnding] = useState(false);
  const [error, setError] = useState("");

  const endRide = async () => {
    setError("");
    setIsEnding(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/rides/end-ride`,
        {
          rideId: props.ride._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.status === 200) {
        setTimeout(() => {
          navigate("/captain-home");
        }, 1500);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to end ride. Please try again.",
      );
      setIsEnding(false);
    }
  };

  return (
    <div className="relative">
      <button
        className="absolute top-0 left-0 right-0 flex justify-center p-2"
        onClick={() => props.setFinishRidePanel(false)}
      >
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i>
      </button>

      <div className="mt-8">
        <p className="title-kicker text-emerald-700">Completion</p>
        <h3 className="mb-6 mt-1 text-2xl font-bold text-slate-900">
          Complete Ride
        </h3>

        {error && (
          <div className="alert-error mb-4">
            <i className="ri-error-warning-line"></i>
            <span>{error}</span>
          </div>
        )}

        {isEnding && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            <i className="ri-checkbox-circle-line"></i>
            <span>Ride completed successfully!</span>
          </div>
        )}

        <div className="surface-block mb-6 flex items-center gap-4 bg-slate-50">
          <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full">
            <i className="text-xl text-white ri-user-fill"></i>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold capitalize text-slate-900">
              {props.ride?.user?.fullname?.firstname || "Passenger"}{" "}
              {props.ride?.user?.fullname?.lastname || ""}
            </h2>
            <p className="mt-1 text-xs text-slate-500">Ride completed</p>
          </div>
        </div>

        <div className="mb-6 space-y-3">
          <div className="flex items-start gap-4 rounded-xl border-l-4 border-green-500 bg-green-50 p-3">
            <i className="flex-shrink-0 text-xl text-green-600 ri-map-pin-user-fill"></i>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-semibold uppercase text-slate-600">
                Pickup
              </h3>
              <p className="mt-1 break-words text-sm text-slate-700">
                {props.ride?.pickup || "Loading..."}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-xl border-l-4 border-red-500 bg-red-50 p-3">
            <i className="flex-shrink-0 text-xl text-red-600 ri-map-pin-2-fill"></i>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-semibold uppercase text-slate-600">
                Destination
              </h3>
              <p className="mt-1 break-words text-sm text-slate-700">
                {props.ride?.destination || "Loading..."}
              </p>
            </div>
          </div>

          {props.ride?.fare && (
            <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-cyan-50 p-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-700">
                  Total Fare
                </h3>
                <p className="mt-1 text-xs text-slate-600">Amount to collect</p>
              </div>
              <p className="text-3xl font-bold text-green-600">
                ₹{props.ride.fare}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8">
          <button onClick={endRide} disabled={isEnding} className="btn-captain">
            {isEnding ? (
              <span className="flex items-center justify-center gap-2">
                <i className="ri-loader-4-line animate-spin"></i>
                Completing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <i className="ri-checkbox-circle-line"></i>
                Complete Ride
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinishRide;
