import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

const ConfirmRidePopUp = (props) => {
  const [otp, setOtp] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    setError("");
    setIsStarting(true);

    try {
      const response = await axios.get(`${API_BASE_URL}/rides/start-ride`, {
        params: {
          rideId: props.ride._id,
          otp: otp,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        props.setConfirmRidePopupPanel(false);
        props.setRidePopupPanel(false);
        navigate("/captain-riding", { state: { ride: props.ride } });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="relative">
      {/* Close Button */}
      <button
        className="absolute top-0 left-0 right-0 flex justify-center p-2"
        onClick={() => {
          props.setConfirmRidePopupPanel(false);
          props.setRidePopupPanel(false);
        }}
      >
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i>
      </button>

      <div className="mt-8">
        <h3 className="mb-6 text-2xl font-bold text-gray-900">
          Confirm Ride to Start
        </h3>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-lg">
            <i className="ri-error-warning-line"></i>
            <span>{error}</span>
          </div>
        )}

        {/* User Info */}
        <div className="flex items-center gap-4 p-4 mb-6 border border-gray-200 rounded-xl bg-gray-50">
          <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full">
            <i className="text-xl text-white ri-user-fill"></i>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 capitalize">
              {props.ride?.user?.fullname?.firstname || "User"}{" "}
              {props.ride?.user?.fullname?.lastname || ""}
            </h2>
            <p className="mt-1 text-xs text-gray-500">Passenger</p>
          </div>
        </div>

        {/* Ride Details */}
        <div className="mb-6 space-y-3">
          {/* Pickup */}
          <div className="flex items-start gap-4 p-3 border-l-4 border-green-500 rounded-lg bg-green-50">
            <i className="flex-shrink-0 text-xl text-green-600 ri-map-pin-user-fill"></i>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-semibold text-gray-600 uppercase">
                Pickup
              </h3>
              <p className="mt-1 text-sm font-medium text-gray-900 break-words">
                {props.ride?.pickup || "Loading..."}
              </p>
            </div>
          </div>

          {/* Destination */}
          <div className="flex items-start gap-4 p-3 border-l-4 border-red-500 rounded-lg bg-red-50">
            <i className="flex-shrink-0 text-xl text-red-600 ri-map-pin-2-fill"></i>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-semibold text-gray-600 uppercase">
                Destination
              </h3>
              <p className="mt-1 text-sm font-medium text-gray-900 break-words">
                {props.ride?.destination || "Loading..."}
              </p>
            </div>
          </div>

          {/* Fare */}
          {props.ride?.fare && (
            <div className="flex items-center justify-between p-4 border border-purple-200 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50">
              <span className="text-sm font-semibold text-gray-700">
                Estimated Fare
              </span>
              <p className="text-2xl font-bold text-purple-600">
                ₹{props.ride?.fare}
              </p>
            </div>
          )}
        </div>

        {/* OTP Form */}
        <div className="mt-6">
          <form onSubmit={submitHandler}>
            <label className="block mb-3 text-sm font-semibold text-gray-700">
              Enter OTP to Start Ride
            </label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
              type="text"
              maxLength={6}
              className="w-full px-6 py-4 font-mono text-lg tracking-widest text-center transition-all border-2 border-gray-300 rounded-lg bg-gray-50 focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-200"
              placeholder="000000"
              disabled={isStarting}
            />

            <button
              type="submit"
              disabled={isStarting || otp.length !== 6}
              className="w-full p-4 mt-4 font-semibold text-white transition-all bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed active:scale-95"
            >
              {isStarting ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="ri-loader-4-line animate-spin"></i>
                  Starting...
                </span>
              ) : (
                "Start Ride"
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                props.setConfirmRidePopupPanel(false);
                props.setRidePopupPanel(false);
              }}
              className="w-full p-4 mt-2 font-semibold text-gray-700 transition-all bg-gray-200 rounded-lg hover:bg-gray-300 active:scale-95"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRidePopUp;
