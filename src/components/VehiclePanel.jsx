import React from "react";

const VehiclePanel = (props) => {
  const vehicleCards = [
    {
      key: "car",
      title: "UberGo",
      seats: 4,
      description: "Budget-friendly rides for everyday travel",
      image:
        "https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg",
      fare: props.fare.car,
    },
    {
      key: "motorcycle",
      title: "Moto",
      seats: 1,
      description: "Quick two-wheeler rides for short routes",
      image:
        "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
      fare: props.fare.motorcycle,
    },
    {
      key: "auto",
      title: "UberAuto",
      seats: 3,
      description: "Convenient auto rickshaw rides in your city",
      image:
        "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png",
      fare: props.fare.auto,
    },
  ];

  const handleSelect = (vehicleKey) => {
    props.setConfirmRidePanel(true);
    props.selectVehicle(vehicleKey);
  };

  return (
    <div className="relative">
      <button
        className="absolute top-0 left-0 right-0 flex justify-center p-2"
        onClick={() => props.setVehiclePanel(false)}
      >
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i>
      </button>

      <div className="mt-8">
        <p className="title-kicker">Selection</p>
        <h3 className="mb-6 mt-1 text-2xl font-bold text-slate-900">
          Choose a Vehicle
        </h3>

        <div className="space-y-3">
          {vehicleCards.map((vehicle) => (
            <button
              key={vehicle.key}
              type="button"
              onClick={() => handleSelect(vehicle.key)}
              className="group flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50 hover:shadow-md active:scale-[0.995]"
            >
              <img
                className="h-12 w-20 rounded-lg object-cover"
                src={vehicle.image}
                alt={vehicle.title}
              />
              <div className="ml-3 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-slate-900">
                    {vehicle.title}
                  </h4>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                    <i className="ri-user-3-fill"></i>
                    {vehicle.seats}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {vehicle.description}
                </p>
              </div>
              <h2 className="text-xl font-bold text-violet-700">
                ₹{vehicle.fare}
              </h2>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VehiclePanel;
