import React, { useContext } from "react";
import { CaptainDataContext } from "../context/CaptainContext";

const formatMoney = (value) => `₹${Number(value || 0).toFixed(2)}`;

const formatNumber = (value) => Number(value || 0).toFixed(2);

const CaptainDetails = ({
  dashboardStats,
  activeStatsTab,
  setActiveStatsTab,
  isStatsLoading,
  statsError,
}) => {
  const { captain } = useContext(CaptainDataContext);

  if (!captain) {
    return (
      <div className="flex items-center justify-center p-6">
        <p className="text-gray-500">Loading captain details...</p>
      </div>
    );
  }

  const activePeriodStats =
    activeStatsTab === "allTime"
      ? dashboardStats?.allTime
      : dashboardStats?.today;

  const summary = activePeriodStats?.summary || {};
  const rides = activePeriodStats?.rides || [];

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
          <h4 className="text-2xl font-bold text-green-600">
            {formatMoney(summary.totalEarnings)}
          </h4>
          <p className="text-xs text-gray-500">
            {activeStatsTab === "today"
              ? "Today's Earnings"
              : "All-Time Earnings"}
          </p>
        </div>
      </div>

      <div className="flex gap-2 p-1 mt-4 bg-gray-100 rounded-2xl">
        <button
          onClick={() => setActiveStatsTab("today")}
          className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
            activeStatsTab === "today"
              ? "bg-white text-green-700 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setActiveStatsTab("allTime")}
          className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
            activeStatsTab === "allTime"
              ? "bg-white text-green-700 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          All Time
        </button>
      </div>

      {statsError && (
        <div className="p-3 mt-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-lg">
          {statsError}
        </div>
      )}

      <div className="p-4 mt-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
        {isStatsLoading ? (
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="p-3 text-center bg-white rounded-xl animate-pulse"
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-200 rounded-full"></div>
                <div className="h-5 mx-auto mb-2 bg-gray-200 rounded w-14"></div>
                <div className="h-3 mx-auto bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-white rounded-full shadow-sm">
                  <i className="text-2xl text-green-600 ri-money-rupee-circle-line"></i>
                </div>
                <h5 className="text-lg font-bold text-gray-900">
                  {formatMoney(summary.totalEarnings)}
                </h5>
                <p className="text-xs text-gray-600">
                  {activeStatsTab === "today"
                    ? "Today's Earnings"
                    : "All-Time Earnings"}
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-white rounded-full shadow-sm">
                  <i className="text-2xl text-blue-600 ri-car-line"></i>
                </div>
                <h5 className="text-lg font-bold text-gray-900">
                  {summary.completedRides || 0}
                </h5>
                <p className="text-xs text-gray-600">
                  {activeStatsTab === "today" ? "Rides Today" : "Total Rides"}
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-white rounded-full shadow-sm">
                  <i className="text-2xl text-purple-600 ri-route-line"></i>
                </div>
                <h5 className="text-lg font-bold text-gray-900">
                  {formatMoney(summary.averageFare)}
                </h5>
                <p className="text-xs text-gray-600">Avg Fare</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="p-3 text-center bg-white rounded-xl shadow-sm">
                <h5 className="text-lg font-bold text-gray-900">
                  {formatNumber(summary.totalDistanceKm)} km
                </h5>
                <p className="text-xs text-gray-600">Distance</p>
              </div>
              <div className="p-3 text-center bg-white rounded-xl shadow-sm">
                <h5 className="text-lg font-bold text-gray-900">
                  {summary.averageSpeedKmph
                    ? `${formatNumber(summary.averageSpeedKmph)} km/h`
                    : "--"}
                </h5>
                <p className="text-xs text-gray-600">Avg Speed</p>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-sm font-semibold text-gray-900">
            {activeStatsTab === "today"
              ? "Today's completed rides"
              : "Recent completed rides"}
          </h5>
          <span className="text-xs text-gray-500">
            {rides.length} {rides.length === 1 ? "ride" : "rides"}
          </span>
        </div>

        <div className="space-y-3 overflow-y-auto max-h-44">
          {rides.length > 0 ? (
            rides.map((ride) => {
              const completedAt = ride.completedAt
                ? new Date(ride.completedAt)
                : null;

              return (
                <div
                  key={ride.id}
                  className="p-3 border border-gray-200 rounded-xl bg-white shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {ride.passengerName || "Passenger"}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 truncate">
                        {ride.pickup}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {ride.destination}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-green-600">
                        {formatMoney(ride.fare)}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {completedAt
                          ? completedAt.toLocaleString()
                          : "Completed"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-sm text-center text-gray-500 bg-white border border-dashed border-gray-200 rounded-xl">
              No completed rides for this period yet.
            </div>
          )}
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
