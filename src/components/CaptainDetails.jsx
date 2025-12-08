import React, { useContext } from "react";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainDetails = () => {
  const { captain } = useContext(CaptainDataContext);

  if (!captain) {
    return (
      <div className="flex items-center justify-center p-6">
        <p className="text-gray-500">Loading captain details...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Captain Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              className="object-cover w-12 h-12 border-2 border-green-500 rounded-full"
              src="https://i.pravatar.cc/150?img=33"
              alt="Captain"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900 capitalize">
              {captain.fullname?.firstname} {captain.fullname?.lastname}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                {captain.vehicle?.vehicleType?.toUpperCase()}
              </span>
              <span className="text-xs text-gray-600">
                {captain.vehicle?.plate}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <h4 className="text-2xl font-bold text-green-600">₹295.20</h4>
          <p className="text-xs text-gray-500">Today's Earnings</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 p-4 mt-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-white rounded-full shadow-sm">
            <i className="text-2xl text-green-600 ri-timer-2-line"></i>
          </div>
          <h5 className="text-lg font-bold text-gray-900">10.2</h5>
          <p className="text-xs text-gray-600">Hours Online</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-white rounded-full shadow-sm">
            <i className="text-2xl text-blue-600 ri-speed-up-line"></i>
          </div>
          <h5 className="text-lg font-bold text-gray-900">45.8</h5>
          <p className="text-xs text-gray-600">Avg Speed</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-white rounded-full shadow-sm">
            <i className="text-2xl text-purple-600 ri-car-line"></i>
          </div>
          <h5 className="text-lg font-bold text-gray-900">8</h5>
          <p className="text-xs text-gray-600">Rides Today</p>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="p-3 mt-4 border border-gray-200 rounded-lg bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="text-xl text-gray-700 ri-car-line"></i>
            <span className="text-sm font-medium text-gray-700 capitalize">
              {captain.vehicle?.color} {captain.vehicle?.vehicleType}
            </span>
          </div>
          <span className="text-sm text-gray-600">
            {captain.vehicle?.capacity} seats
          </span>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails;
