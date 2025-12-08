import React from "react";

const WaitingForDriver = (props) => {
  return (
    <div className="relative">
      {/* Close Button */}
      <button
        className="absolute top-0 left-0 right-0 flex justify-center p-2"
        onClick={() => props.setWaitingForDriver(false)}
      >
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i>
      </button>

      <div className="mt-8">
        <h3 className="mb-6 text-2xl font-bold text-gray-900">
          Driver is on the way!
        </h3>

        {/* Driver Info Card */}
        <div className="p-4 mb-6 border-2 border-green-400 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center justify-between">
            <img
              className="h-16"
              src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
              alt="Vehicle"
            />
            <div className="text-right">
              <h2 className="text-lg font-bold text-gray-900 capitalize">
                {props.ride?.captain?.fullname?.firstname}
              </h2>
              <h4 className="text-xl font-semibold text-gray-800">
                {props.ride?.captain?.vehicle?.plate}
              </h4>
              <p className="text-sm text-gray-600 capitalize">
                {props.ride?.captain?.vehicle?.color}{" "}
                {props.ride?.captain?.vehicle?.vehicleType}
              </p>
            </div>
          </div>
        </div>

        {/* OTP Display */}
        <div className="p-4 mb-4 text-center border-2 border-purple-300 rounded-xl bg-purple-50">
          <p className="text-sm font-medium text-gray-700">Your OTP</p>
          <h1 className="mt-2 text-4xl font-bold tracking-widest text-purple-600">
            {props.ride?.otp}
          </h1>
          <p className="mt-2 text-xs text-gray-600">
            Share this with your driver
          </p>
        </div>

        {/* Ride Details */}
        <div className="space-y-3">
          {/* Pickup */}
          <div className="flex items-start gap-4 p-3 border-2 border-gray-200 rounded-lg">
            <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-green-100 rounded-full">
              <i className="text-xl text-green-600 ri-map-pin-user-fill"></i>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-700">Pickup</h3>
              <p className="mt-1 text-sm text-gray-600">{props.ride?.pickup}</p>
            </div>
          </div>

          {/* Destination */}
          <div className="flex items-start gap-4 p-3 border-2 border-gray-200 rounded-lg">
            <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-red-100 rounded-full">
              <i className="text-xl text-red-600 ri-map-pin-2-fill"></i>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-700">
                Destination
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {props.ride?.destination}
              </p>
            </div>
          </div>

          {/* Fare */}
          <div className="flex items-start gap-4 p-3 border-2 border-gray-200 rounded-lg">
            <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full">
              <i className="text-xl text-purple-600 ri-money-rupee-circle-fill"></i>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-700">Fare</h3>
              <p className="mt-1 text-xl font-bold text-green-600">
                ₹{props.ride?.fare}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Button */}
        <button className="w-full p-4 mt-6 font-semibold text-white transition-all bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl hover:from-green-600 hover:to-emerald-700">
          <i className="mr-2 ri-phone-line"></i>
          Contact Driver
        </button>
      </div>
    </div>
  );
};

export default WaitingForDriver;
