import React from "react";

const RidePopUp = (props) => {
  return (
    <div className="relative">
      {/* Close Button */}
      <button
        className="absolute top-0 left-0 right-0 flex justify-center p-2"
        onClick={() => props.setRidePopupPanel(false)}
      >
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i>
      </button>

      <div className="mt-8">
        <h3 className="mb-6 text-2xl font-bold text-gray-900">
          New Ride Request
        </h3>

        {/* User Info Card */}
        <div className="flex items-center gap-4 p-4 mb-6 border border-gray-200 rounded-xl bg-gray-50">
          <div className="flex items-center justify-center bg-purple-600 rounded-full w-14 h-14">
            <i className="text-2xl text-white ri-user-fill"></i>
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

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => {
              props.setConfirmRidePopupPanel(true);
              props.confirmRide?.();
            }}
            disabled={props.isConfirming}
            className="w-full p-4 font-semibold text-white transition-all bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed active:scale-95"
          >
            {props.isConfirming ? (
              <span className="flex items-center justify-center gap-2">
                <i className="ri-loader-4-line animate-spin"></i>
                Accepting...
              </span>
            ) : (
              "Accept Ride"
            )}
          </button>

          <button
            onClick={() => props.setRidePopupPanel(false)}
            className="w-full p-4 font-semibold text-gray-700 transition-all bg-gray-200 rounded-lg hover:bg-gray-300 active:scale-95"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default RidePopUp;
