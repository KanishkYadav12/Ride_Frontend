import React from "react";

const LookingForDriver = (props) => {
  const vehicleImages = {
    car: "https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg",
    motorcycle:
      "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
    auto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png",
  };

  return (
    <div className="relative">
      {/* Close Button */}
      <button
        className="absolute top-0 left-0 right-0 flex justify-center p-2"
        onClick={() => props.setVehicleFound(false)}
      >
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i>
      </button>

      <div className="mt-8">
        <h3 className="mb-6 text-2xl font-bold text-gray-900">
          Looking for a Driver
        </h3>

        {/* Loading Animation */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <img
              className="h-24 animate-pulse"
              src={vehicleImages[props.vehicleType] || vehicleImages.car}
              alt={props.vehicleType}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border-4 border-purple-200 rounded-full border-t-purple-600 animate-spin"></div>
            </div>
          </div>
        </div>

        {/* Status Message */}
        <div className="p-4 mb-4 text-center border-2 border-purple-200 rounded-xl bg-purple-50">
          <p className="text-sm font-semibold text-purple-700">
            Finding the best driver for you...
          </p>
          <p className="mt-1 text-xs text-purple-600">
            Wait until someone accepts it!!
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
              <p className="mt-1 text-sm text-gray-600">{props.pickup}</p>
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
              <p className="mt-1 text-sm text-gray-600">{props.destination}</p>
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
                ₹{props.fare[props.vehicleType]}
              </p>
            </div>
          </div>
        </div>

        {/* Cancel Button */}
        <button
          onClick={() => props.setVehicleFound(false)}
          className="w-full p-3 mt-6 font-semibold text-gray-700 transition-all bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Cancel Search
        </button>
      </div>
    </div>
  );
};

export default LookingForDriver;
