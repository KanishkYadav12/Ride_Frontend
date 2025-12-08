import React from "react";

const ConfirmRide = (props) => {
  const vehicleImages = {
    car: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
    motorcycle:
      "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
    auto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png",
  };

  return (
    <div className="relative">
      {/* Close Button */}
      <button
        className="absolute top-0 left-0 right-0 flex justify-center p-2"
        onClick={() => props.setConfirmRidePanel(false)}
      >
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i>
      </button>

      <div className="mt-8">
        <h3 className="mb-6 text-2xl font-bold text-gray-900">
          Confirm your Ride
        </h3>

        {/* Vehicle Image */}
        <div className="flex justify-center mb-6">
          <img
            className="h-24"
            src={vehicleImages[props.vehicleType] || vehicleImages.car}
            alt={props.vehicleType}
          />
        </div>

        {/* Ride Details */}
        <div className="space-y-3">
          {/* Pickup */}
          <div className="flex items-start gap-4 p-4 transition-all border-2 border-gray-200 rounded-xl hover:border-green-300">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
              <i className="text-xl text-green-600 ri-map-pin-user-fill"></i>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900">
                Pickup Location
              </h3>
              <p className="mt-1 text-sm text-gray-600">{props.pickup}</p>
            </div>
          </div>

          {/* Destination */}
          <div className="flex items-start gap-4 p-4 transition-all border-2 border-gray-200 rounded-xl hover:border-red-300">
            <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
              <i className="text-xl text-red-600 ri-map-pin-2-fill"></i>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900">
                Destination
              </h3>
              <p className="mt-1 text-sm text-gray-600">{props.destination}</p>
            </div>
          </div>

          {/* Fare */}
          <div className="flex items-start gap-4 p-4 transition-all border-2 border-gray-200 rounded-xl hover:border-purple-300">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
              <i className="text-xl text-purple-600 ri-money-rupee-circle-fill"></i>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900">Fare</h3>
              <p className="mt-1 text-2xl font-bold text-green-600">
                ₹{props.fare[props.vehicleType]}
              </p>
            </div>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={() => {
            props.setVehicleFound(true);
            props.setConfirmRidePanel(false);
            props.createRide();
          }}
          disabled={props.isCreatingRide}
          className="w-full p-4 mt-6 font-semibold text-white transition-all bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500"
        >
          {props.isCreatingRide ? (
            <span className="flex items-center justify-center gap-2">
              <i className="ri-loader-4-line animate-spin"></i>
              Booking...
            </span>
          ) : (
            "Confirm Ride"
          )}
        </button>
      </div>
    </div>
  );
};

export default ConfirmRide;
