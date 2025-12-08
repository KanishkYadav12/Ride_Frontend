import React from "react";

const LocationSearchPanel = ({
  suggestions,
  setVehiclePanel,
  setPanelOpen,
  setPickup,
  setDestination,
  activeField,
  destination,
  pickup,
}) => {
  const handleSuggestionClick = (suggestion) => {
    if (activeField === "pickup") {
      setPickup(suggestion);
      // Keep panel open, don't close it yet
    } else if (activeField === "destination") {
      setDestination(suggestion);
      // Close panel after destination is selected so "Find Trip" button is visible
      setTimeout(() => {
        setPanelOpen(false);
      }, 100);
    }
  };

  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <i className="text-4xl text-gray-300 ri-map-pin-line"></i>
        <p className="mt-2 text-sm text-gray-500">
          {activeField === "pickup"
            ? "Start typing your pickup location..."
            : "Start typing your destination..."}
        </p>
      </div>
    );
  }

  return (
    <div className="py-2">
      <h4 className="mb-3 text-sm font-semibold text-gray-700">
        {activeField === "pickup" ? "Pickup Locations" : "Destinations"}
      </h4>

      <div className="space-y-2">
        {suggestions.map((elem, idx) => (
          <div
            key={idx}
            onClick={() => handleSuggestionClick(elem)}
            className="flex items-center gap-4 p-3 transition-all border-2 border-gray-200 cursor-pointer rounded-xl hover:border-purple-400 hover:bg-purple-50 active:scale-98"
          >
            <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full">
              <i className="text-lg text-purple-600 ri-map-pin-fill"></i>
            </div>
            <div className="flex-1 overflow-hidden">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {elem}
              </h4>
            </div>
            <i className="text-gray-400 ri-arrow-right-s-line"></i>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationSearchPanel;
