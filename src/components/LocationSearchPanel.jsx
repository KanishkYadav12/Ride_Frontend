import React from "react";

const LocationSearchPanel = ({
  suggestions,
  setPanelOpen,
  setPickup,
  setDestination,
  activeField,
  isLoading,
  error,
  onClose,
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
      setPanelOpen(true);
      return;
    } else if (activeField === "destination") {
      setDestination(label);
      // close suggestions once destination is selected
      setPanelOpen(false);
      if (onClose) {
        onClose();
      }
    }
  };

  const getHelperText = () => {
    if (activeField === "pickup") {
      return "Type at least 3 characters to see pickup suggestions.";
    }

    if (activeField === "destination") {
      return "Type at least 3 characters to see destination suggestions.";
    }

    return "Select a field to search.";
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-4 py-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <i className="text-xl text-red-500 ri-error-warning-line"></i>
        </div>
        <p className="text-sm font-medium text-slate-900">
          Suggestions unavailable
        </p>
        <p className="text-xs leading-5 text-slate-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="py-3">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 pb-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">
            {activeField === "pickup"
              ? "Pickup suggestions"
              : "Destination suggestions"}
          </h4>
          <p className="mt-1 text-xs text-slate-500">{getHelperText()}</p>
        </div>
        {isLoading && (
          <i className="text-base text-purple-600 ri-loader-4-line animate-spin"></i>
        )}
      </div>

      {isLoading ? (
        <div className="px-4 py-4 space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-gray-100"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : !suggestions || suggestions.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 px-4 py-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-50">
            <i className="text-xl text-purple-600 ri-map-pin-line"></i>
          </div>
          <p className="text-sm font-medium text-slate-900">
            No suggestions yet
          </p>
          <p className="text-xs leading-5 text-slate-500">{getHelperText()}</p>
        </div>
      ) : (
        <div className="p-3 space-y-2">
          {suggestions.map((item, idx) => {
            const label = getLabel(item);
            return (
              <button
                key={`${label}-${idx}`}
                type="button"
                onClick={() => handleSuggestionClick(item)}
                className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left text-sm transition-all hover:border-violet-300 hover:bg-violet-50 active:scale-[0.99]"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-100">
                  <i className="ri-map-pin-2-fill text-lg text-violet-600"></i>
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-[13px] font-medium text-slate-900">
                    {label}
                  </p>
                </div>
                <i className="text-gray-400 ri-arrow-right-s-line"></i>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LocationSearchPanel;
