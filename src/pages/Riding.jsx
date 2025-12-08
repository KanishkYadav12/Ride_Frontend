import React, { useEffect, useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";

const Riding = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const { ride } = location.state || {};

  const [isEnding, setIsEnding] = useState(false);
  const [rideData, setRideData] = useState(ride);

  // Socket listener for ride updates and completion
  useEffect(() => {
    if (!socket) return;

    const handleRideEnded = () => {
      console.log("🏁 Ride ended");
      setIsEnding(true);
      setTimeout(() => {
        navigate("/home");
      }, 2000);
    };

    const handleRideUpdated = (updatedRide) => {
      console.log("📍 Ride updated:", updatedRide);
      setRideData(updatedRide);
    };

    socket.on("ride-ended", handleRideEnded);
    socket.on("ride-updated", handleRideUpdated);

    return () => {
      socket.off("ride-ended", handleRideEnded);
      socket.off("ride-updated", handleRideUpdated);
    };
  }, [socket, navigate]);

  // Redirect if no ride data
  useEffect(() => {
    if (!ride) {
      navigate("/home");
    }
  }, [ride, navigate]);

  if (!rideData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <i className="text-6xl text-purple-600 ri-loader-4-line animate-spin"></i>
          <p className="mt-4 text-lg font-medium text-gray-700">
            Loading ride...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="relative h-1/2 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
        <button
          onClick={() => navigate("/home")}
          className="absolute flex items-center justify-center w-10 h-10 transition-all bg-white rounded-full shadow-lg right-4 top-4 hover:bg-gray-100"
        >
          <i className="text-lg font-medium ri-home-5-line"></i>
        </button>

        {/* Map placeholder */}
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-white">
            <i className="text-6xl ri-map-pin-line"></i>
            <p className="mt-4 text-xl font-semibold">En Route</p>
            <p className="text-sm opacity-75">Your ride is on the way</p>
          </div>
        </div>
      </div>

      {/* Ride Details */}
      <div className="p-6 -mt-6 bg-white shadow-2xl h-1/2 rounded-t-3xl">
        {isEnding && (
          <div className="p-4 mb-4 text-center text-green-700 bg-green-100 border border-green-200 rounded-xl">
            <i className="text-2xl ri-checkbox-circle-line"></i>
            <p className="mt-2 font-semibold">Ride completed! Redirecting...</p>
          </div>
        )}

        {/* Captain Info */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center justify-center flex-shrink-0 w-16 h-16 bg-gray-200 rounded-full">
            <i className="text-2xl text-gray-600 ri-user-fill"></i>
          </div>
          <div className="flex-1 ml-4">
            <h2 className="text-lg font-bold text-gray-900 capitalize">
              {rideData?.captain?.fullname?.firstname || "Captain"}{" "}
              {rideData?.captain?.fullname?.lastname || ""}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              {rideData?.captain?.vehicle?.vehicleType && (
                <span className="px-2 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full">
                  {rideData.captain.vehicle.vehicleType.toUpperCase()}
                </span>
              )}
              {rideData?.captain?.vehicle?.plate && (
                <span className="text-sm font-medium text-gray-700">
                  {rideData.captain.vehicle.plate}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <i className="text-yellow-500 ri-star-fill"></i>
            <span className="font-semibold text-gray-900">
              {rideData?.captain?.rating || "N/A"}
            </span>
          </div>
        </div>

        {/* Vehicle Details */}
        {rideData?.captain?.vehicle && (
          <div className="p-4 mt-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between">
              {rideData.captain.vehicle.color && (
                <div>
                  <p className="text-xs text-gray-500">Color</p>
                  <p className="font-semibold text-gray-900 capitalize">
                    {rideData.captain.vehicle.color}
                  </p>
                </div>
              )}
              {rideData.captain.vehicle.capacity && (
                <div>
                  <p className="text-xs text-gray-500">Capacity</p>
                  <p className="font-semibold text-gray-900">
                    {rideData.captain.vehicle.capacity} seats
                  </p>
                </div>
              )}
              <div className="text-right">
                <p className="text-xs text-gray-500">Status</p>
                <span className="inline-block px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                  Ongoing
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Trip Details */}
        <div className="mt-4 space-y-3">
          {/* Pickup */}
          <div className="flex items-start gap-4 p-3 transition-all border-2 border-gray-200 rounded-xl hover:border-purple-300">
            <i className="flex-shrink-0 text-2xl text-green-600 ri-map-pin-user-fill"></i>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900">Pickup</h3>
              <p className="text-sm text-gray-600 break-words">
                {rideData?.pickup || "Loading..."}
              </p>
            </div>
          </div>

          {/* Destination */}
          <div className="flex items-start gap-4 p-3 transition-all border-2 border-gray-200 rounded-xl hover:border-purple-300">
            <i className="flex-shrink-0 text-2xl text-red-600 ri-map-pin-2-fill"></i>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900">Destination</h3>
              <p className="text-sm text-gray-600 break-words">
                {rideData?.destination || "Loading..."}
              </p>
            </div>
          </div>

          {/* Fare */}
          {rideData?.fare && (
            <div className="flex items-start gap-4 p-3 transition-all border-2 border-gray-200 rounded-xl hover:border-purple-300">
              <i className="flex-shrink-0 text-2xl text-purple-600 ri-money-rupee-circle-fill"></i>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Fare</h3>
                <p className="text-2xl font-bold text-green-600">
                  ₹{rideData.fare}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          disabled={isEnding}
          className="w-full p-3 mt-4 font-semibold text-white transition-all bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed active:scale-95"
        >
          {isEnding ? (
            <span className="flex items-center justify-center gap-2">
              <i className="ri-loader-4-line animate-spin"></i>
              Completing...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <i className="ri-phone-line"></i>
              Contact Captain
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Riding;
