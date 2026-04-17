import React from "react";

const RidePopUp = (props) => {
  return (
    <div className="relative">
      <button
        className="absolute top-0 left-0 right-0 flex justify-center p-2"
        onClick={() => props.setRidePopupPanel(false)}
      >
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i>
      </button>

      <div className="mt-8">
        <p className="title-kicker text-emerald-700">Incoming</p>
        <h3 className="mb-6 mt-1 text-2xl font-bold text-slate-900">
          New Ride Request
        </h3>

        <div className="surface-block mb-6 flex items-center gap-4 bg-slate-50">
          <div className="flex items-center justify-center bg-purple-600 rounded-full w-14 h-14">
            <i className="text-2xl text-white ri-user-fill"></i>
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

        <div className="space-y-2">
          <button
            onClick={() => {
              props.setConfirmRidePopupPanel(true);
              props.confirmRide?.();
            }}
            disabled={props.isConfirming}
            className="btn-captain"
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
            className="btn-soft"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default RidePopUp;
