import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

const ConfirmRidePopUp = (props) => {
  const [otp, setOtp] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isRideUnavailableError =
    error.toLowerCase().includes("ride not found") ||
    error.toLowerCase().includes("not assigned") ||
    error.toLowerCase().includes("ride not available");

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
        <p className="title-kicker text-emerald-700">Verification</p>
        <h3 className="mb-6 mt-1 text-2xl font-bold text-slate-900">
          Confirm Ride to Start
        </h3>

        {error && (
          <div className="alert-error mb-4">
            <i className="ri-error-warning-line"></i>
            <span>{error}</span>
          </div>
        )}

        <div className="surface-block mb-6 flex items-center gap-4 bg-slate-50">
          <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full">
            <i className="text-xl text-white ri-user-fill"></i>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold capitalize text-slate-900">
              {props.ride?.user?.fullname?.firstname || "User"}{" "}
              {props.ride?.user?.fullname?.lastname || ""}
            </h2>
            <p className="mt-1 text-xs text-slate-500">Passenger</p>
          </div>
        </div>

        <div className="mb-6 space-y-3">
          <div className="flex items-start gap-4 rounded-xl border-l-4 border-green-500 bg-green-50 p-3">
            <i className="flex-shrink-0 text-xl text-green-600 ri-map-pin-user-fill"></i>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-semibold uppercase text-slate-600">
                Pickup
              </h3>
              <p className="mt-1 break-words text-sm font-medium text-slate-900">
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
              <p className="mt-1 break-words text-sm font-medium text-slate-900">
                {props.ride?.destination || "Loading..."}
              </p>
            </div>
          </div>

          {props.ride?.fare && (
            <div className="flex items-center justify-between rounded-xl border border-violet-200 bg-gradient-to-r from-violet-50 to-indigo-50 p-4">
              <span className="text-sm font-semibold text-slate-700">
                Estimated Fare
              </span>
              <p className="text-2xl font-bold text-violet-600">
                ₹{props.ride?.fare}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6">
          <form onSubmit={submitHandler}>
            <label className="field-label">Enter OTP to Start Ride</label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
              type="text"
              maxLength={6}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-6 py-4 text-center font-mono text-lg tracking-widest text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              placeholder="000000"
              disabled={isStarting}
            />

            <button
              type="submit"
              disabled={isStarting || otp.length !== 6}
              className="btn-captain mt-4"
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
              className="btn-soft mt-2"
            >
              Cancel
            </button>

            {isRideUnavailableError && (
              <button
                type="button"
                onClick={() => {
                  props.setConfirmRidePopupPanel(false);
                  props.setRidePopupPanel(false);
                  navigate("/captain-home");
                }}
                className="btn-user mt-2"
              >
                Go to Home
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRidePopUp;
