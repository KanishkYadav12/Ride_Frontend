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
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              className="h-12 w-12 rounded-full border-2 border-emerald-500 object-cover"
              src="https://i.pravatar.cc/150?img=33"
              alt="Captain"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h4 className="text-lg font-semibold capitalize text-slate-900">
              {captain.fullname?.firstname} {captain.fullname?.lastname}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                {captain.vehicle?.vehicleType?.toUpperCase()}
              </span>
              <span className="text-xs text-slate-600">
                {captain.vehicle?.plate}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <h4 className="text-2xl font-bold text-emerald-600">
            {formatMoney(summary.totalEarnings)}
          </h4>
          <p className="text-xs text-slate-500">
            {activeStatsTab === "today"
              ? "Today's Earnings"
              : "All-Time Earnings"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-2 rounded-2xl bg-slate-100 p-1">
        <button
          onClick={() => setActiveStatsTab("today")}
          className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
            activeStatsTab === "today"
              ? "bg-white text-emerald-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setActiveStatsTab("allTime")}
          className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
            activeStatsTab === "allTime"
              ? "bg-white text-emerald-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          All Time
        </button>
      </div>

      {statsError && <div className="alert-error mt-4">{statsError}</div>}

      <div className="mt-4 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-cyan-50 p-4">
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
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                  <i className="text-2xl text-green-600 ri-money-rupee-circle-line"></i>
                </div>
                <h5 className="text-lg font-bold text-slate-900">
                  {formatMoney(summary.totalEarnings)}
                </h5>
                <p className="text-xs text-slate-600">
                  {activeStatsTab === "today"
                    ? "Today's Earnings"
                    : "All-Time Earnings"}
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                  <i className="text-2xl text-blue-600 ri-car-line"></i>
                </div>
                <h5 className="text-lg font-bold text-slate-900">
                  {summary.completedRides || 0}
                </h5>
                <p className="text-xs text-slate-600">
                  {activeStatsTab === "today" ? "Rides Today" : "Total Rides"}
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                  <i className="text-2xl text-purple-600 ri-route-line"></i>
                </div>
                <h5 className="text-lg font-bold text-slate-900">
                  {formatMoney(summary.averageFare)}
                </h5>
                <p className="text-xs text-slate-600">Avg Fare</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="rounded-xl bg-white p-3 text-center shadow-sm">
                <h5 className="text-lg font-bold text-slate-900">
                  {formatNumber(summary.totalDistanceKm)} km
                </h5>
                <p className="text-xs text-slate-600">Distance</p>
              </div>
              <div className="rounded-xl bg-white p-3 text-center shadow-sm">
                <h5 className="text-lg font-bold text-slate-900">
                  {summary.averageSpeedKmph
                    ? `${formatNumber(summary.averageSpeedKmph)} km/h`
                    : "--"}
                </h5>
                <p className="text-xs text-slate-600">Avg Speed</p>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-sm font-semibold text-slate-900">
            {activeStatsTab === "today"
              ? "Today's completed rides"
              : "Recent completed rides"}
          </h5>
          <span className="text-xs text-slate-500">
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
                  className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {ride.passengerName || "Passenger"}
                      </p>
                      <p className="mt-1 truncate text-xs text-slate-500">
                        {ride.pickup}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {ride.destination}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-emerald-600">
                        {formatMoney(ride.fare)}
                      </p>
                      <p className="text-[11px] text-slate-500">
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
            <div className="rounded-xl border border-dashed border-slate-200 bg-white p-4 text-center text-sm text-slate-500">
              No completed rides for this period yet.
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="ri-car-line text-xl text-slate-700"></i>
            <span className="text-sm font-medium capitalize text-slate-700">
              {captain.vehicle?.color} {captain.vehicle?.vehicleType}
            </span>
          </div>
          <span className="text-sm text-slate-600">
            {captain.vehicle?.capacity} seats
          </span>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails;
