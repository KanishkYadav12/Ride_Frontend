import React from "react";

const VehiclePanel = (props) => {
  return (
    <div className="relative">
      {/* Close Button */}
      <button
        className="absolute top-0 left-0 right-0 flex justify-center p-2"
        onClick={() => props.setVehiclePanel(false)}
      >
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i>
      </button>

      <div className="mt-8">
        <h3 className="mb-6 text-2xl font-bold text-gray-900">
          Choose a Vehicle
        </h3>

        <div className="space-y-3">
          {/* Car Option */}
          <div
            onClick={() => {
              props.setConfirmRidePanel(true);
              props.selectVehicle("car");
            }}
            className="flex items-center justify-between p-4 transition-all border-2 border-gray-200 cursor-pointer rounded-xl hover:border-purple-400 hover:bg-purple-50 active:scale-98"
          >
            <img
              className="h-12"
              src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
              alt="Car"
            />
            <div className="flex-1 ml-4">
              <div className="flex items-center gap-2">
                <h4 className="text-base font-semibold text-gray-900">
                  UberGo
                </h4>
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  <i className="ri-user-3-fill"></i>
                  <span>4</span>
                </span>
              </div>

              <p className="text-xs text-gray-500">
                Budget-friendly rides for everyone
              </p>
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              ₹{props.fare.car}
            </h2>
          </div>

          {/* Motorcycle Option */}
          <div
            onClick={() => {
              props.setConfirmRidePanel(true);
              props.selectVehicle("motorcycle");
            }}
            className="flex items-center justify-between p-4 transition-all border-2 border-gray-200 cursor-pointer rounded-xl hover:border-purple-400 hover:bg-purple-50 active:scale-98"
          >
            <img
              className="h-12"
              src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png"
              alt="Motorcycle"
            />
            <div className="flex-1 ml-4">
              <div className="flex items-center gap-2">
                <h4 className="text-base font-semibold text-gray-900">Moto</h4>
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  <i className="ri-user-3-fill"></i>
                  <span>1</span>
                </span>
              </div>

              <p className="text-xs text-gray-500">
                Quick & economical two-wheeler rides
              </p>
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              ₹{props.fare.motorcycle}
            </h2>
          </div>

          {/* Auto Option */}
          <div
            onClick={() => {
              props.setConfirmRidePanel(true);
              props.selectVehicle("auto");
            }}
            className="flex items-center justify-between p-4 transition-all border-2 border-gray-200 cursor-pointer rounded-xl hover:border-purple-400 hover:bg-purple-50 active:scale-98"
          >
            <img
              className="h-12"
              src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png"
              alt="Auto"
            />
            <div className="flex-1 ml-4">
              <div className="flex items-center gap-2">
                <h4 className="text-base font-semibold text-gray-900">
                  UberAuto
                </h4>
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  <i className="ri-user-3-fill"></i>
                  <span>3</span>
                </span>
              </div>

              <p className="text-xs text-gray-500">
                Convenient auto rickshaw rides
              </p>
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              ₹{props.fare.auto}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehiclePanel;
