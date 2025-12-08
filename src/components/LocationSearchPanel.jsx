import React from "react";

const LocationSearchPanel = ({
  suggestions,
  setPanelOpen,
  setPickup,
  setDestination,
  activeField,
}) => {
  // Safely get a display label from different suggestion shapes
  const getLabel = (item) => {
    if (typeof item === "string") return item;
    if (item?.display_name) return item.display_name;
    if (item?.name) return item.name;
    return JSON.stringify(item);
  };

  const handleSuggestionClick = (item) => {
    const label = getLabel(item);

    if (activeField === "pickup") {
      setPickup(label);
      // keep panel open so user can now type/select destination
    } else if (activeField === "destination") {
      setDestination(label);
      // close suggestions once destination is selected
      setPanelOpen(false);
    }
  };

  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <i className="text-3xl text-gray-300 ri-map-pin-line"></i>
        <p className="mt-2 text-xs text-gray-500">
          {activeField === "pickup"
            ? "Start typing your pickup location..."
            : "Start typing your destination..."}
        </p>
      </div>
    );
  }

  return (
    <div className="py-2">
      <h4 className="mb-2 text-xs font-semibold text-gray-600">
        {activeField === "pickup" ? "Pickup locations" : "Destinations"}
      </h4>

      <div className="space-y-2">
        {suggestions.map((item, idx) => {
          const label = getLabel(item);
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleSuggestionClick(item)}
              className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 text-left text-sm transition-all hover:border-purple-400 hover:bg-purple-50 active:scale-[0.99]"
            >
              <div className="flex items-center justify-center flex-shrink-0 bg-gray-100 rounded-full h-9 w-9">
                <i className="text-lg text-purple-600 ri-map-pin-fill"></i>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-[13px] font-medium text-gray-900">
                  {label}
                </p>
              </div>
              <i className="text-gray-400 ri-arrow-right-s-line"></i>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LocationSearchPanel;
