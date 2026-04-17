import React, { useEffect, useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";

const Riding = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const { ride } = location.state || {};

  const [isRideCompleted, setIsRideCompleted] = useState(false);
  const [rideData, setRideData] = useState(ride);

  const captainName =
    `${rideData?.captain?.fullname?.firstname || ""} ${rideData?.captain?.fullname?.lastname || ""}`.trim();
  const vehicleType = rideData?.captain?.vehicle?.vehicleType || "--";
  const vehiclePlate = rideData?.captain?.vehicle?.plate || "--";
  const vehicleColor = rideData?.captain?.vehicle?.color || "";
  const rideStatus = String(rideData?.status || "ongoing").toLowerCase();
  const rideStatusLabel =
    rideStatus.charAt(0).toUpperCase() + rideStatus.slice(1);
  const distanceKm =
    typeof rideData?.distance === "number" ? rideData.distance / 1000 : null;
  const durationMins =
    typeof rideData?.duration === "number"
      ? Math.max(1, Math.round(rideData.duration / 60))
      : null;
  const completedAtLabel = rideData?.completedAt
    ? new Date(rideData.completedAt).toLocaleString()
    : null;

  const formatDistance = (value) => {
    if (value === null) return "--";
    if (value < 10) return `${value.toFixed(1)} km`;
    return `${Math.round(value)} km`;
  };

  useEffect(() => {
    if (!socket) return;

    const handleRideEnded = (endedRide) => {
      if (endedRide) {
        setRideData(endedRide);
      }
      setIsRideCompleted(true);
    };

    const handleRideUpdated = (updatedRide) => {
      setRideData(updatedRide);
    };

    socket.on("ride-ended", handleRideEnded);
    socket.on("ride-updated", handleRideUpdated);

    return () => {
      socket.off("ride-ended", handleRideEnded);
      socket.off("ride-updated", handleRideUpdated);
    };
  }, [socket, navigate]);

  useEffect(() => {
    if (!ride) {
      navigate("/home");
    }
  }, [ride, navigate]);

  if (!rideData) {
    return (
      <div className="screen-base screen-user flex items-center justify-center px-6">
        <div className="aurora-backdrop" />
        <div className="panel-card relative z-10 w-[min(92vw,420px)] p-8 text-center">
          <i className="ri-loader-4-line animate-spin text-6xl text-violet-600"></i>
          <p className="mt-4 text-lg font-medium text-slate-700">
            Loading ride...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-base screen-user">
      <div className="aurora-backdrop" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="flex items-center justify-between px-4 pt-4 sm:px-6">
          <button
            onClick={() => navigate("/home")}
            className="icon-btn"
            aria-label="Go home"
          >
            <i className="ri-home-5-line text-lg"></i>
          </button>

          <div className="rounded-full border border-violet-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-700 shadow-sm">
            {isRideCompleted ? "Trip completed" : "Trip in progress"}
          </div>

          <button
            onClick={() => navigate("/home")}
            className="icon-btn"
            aria-label="Back to home"
          >
            <i className="ri-arrow-left-s-line text-xl"></i>
          </button>
        </div>

        <div className="relative mx-4 mt-4 overflow-hidden rounded-[2rem] border border-violet-200 bg-gradient-to-br from-violet-600 via-indigo-600 to-sky-600 shadow-[0_30px_80px_-35px_rgba(37,99,235,0.65)] sm:mx-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.2),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.1),_transparent_30%)]" />
          <div className="relative flex min-h-[42vh] flex-col items-center justify-center px-6 py-10 text-center">
            <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/12 shadow-2xl backdrop-blur-md">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-fuchsia-600 shadow-lg">
                <i className="ri-map-pin-line text-3xl"></i>
              </div>
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/80">
              En route
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              {isRideCompleted
                ? "Your ride is completed"
                : "Your ride is on the way"}
            </h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/85 sm:text-base">
              {isRideCompleted
                ? "Thanks for riding with us. Review your trip summary below."
                : "Stay ready, keep your phone nearby, and follow the live trip details below."}
            </p>

            <div className="mt-6 grid w-full max-w-md grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/15 bg-white/12 px-3 py-3 backdrop-blur-md">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/65">
                  Distance
                </p>
                <p className="mt-1 text-base font-bold text-white">
                  {formatDistance(distanceKm)}
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/12 px-3 py-3 backdrop-blur-md">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/65">
                  ETA
                </p>
                <p className="mt-1 text-base font-bold text-white">
                  {durationMins ? `${durationMins} min` : "--"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/12 px-3 py-3 backdrop-blur-md">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/65">
                  Fare
                </p>
                <p className="mt-1 text-base font-bold text-white">
                  ₹{rideData?.fare || "--"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="sheet-panel -mt-8 flex flex-1 flex-col rounded-t-[2.25rem] px-4 pb-5 pt-5 text-slate-900 shadow-[0_-20px_60px_rgba(37,99,235,0.18)] sm:px-6">
          {isRideCompleted && (
            <div className="mb-4 flex items-start gap-3 rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-emerald-900 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <i className="ri-checkbox-circle-line text-xl"></i>
              </div>
              <div>
                <p className="font-semibold">Ride completed</p>
                <p className="text-sm text-emerald-800/80">
                  Your trip is finished. You can head back to home anytime.
                </p>
                {completedAtLabel && (
                  <p className="mt-1 text-xs text-emerald-800/70">
                    Completed at: {completedAtLabel}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-4 pb-4">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Driver
                </p>
                <h2 className="mt-1 truncate text-xl font-black text-slate-900">
                  {captainName || "--"}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-violet-700">
                    {vehicleType}
                  </span>
                  <span className="text-sm font-medium text-slate-600">
                    {vehicleColor ? `${vehicleColor} ` : ""}
                    {vehiclePlate}
                  </span>
                </div>
              </div>

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <i className="ri-user-3-fill text-2xl"></i>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
              <div className="rounded-2xl bg-slate-50 px-3 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Vehicle
                </p>
                <p className="mt-1 text-sm font-bold capitalize text-slate-900">
                  {vehicleColor || "--"} {vehicleType}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Status
                </p>
                <p className="mt-1 text-sm font-bold text-emerald-600">
                  {isRideCompleted ? "Completed" : rideStatusLabel}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Fare
                </p>
                <p className="mt-1 text-sm font-bold text-slate-900">
                  ₹{rideData?.fare || "--"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between pb-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Trip route
                </p>
                <h3 className="mt-1 text-lg font-bold text-slate-900">
                  Live journey details
                </h3>
              </div>
              <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {isRideCompleted ? "Overview" : "Live"}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <i className="ri-map-pin-user-fill text-lg"></i>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Pickup
                  </p>
                  <p className="mt-1 break-words text-sm font-medium leading-6 text-slate-800">
                    {rideData?.pickup || "Loading..."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-700">
                  <i className="ri-flag-2-fill text-lg"></i>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Destination
                  </p>
                  <p className="mt-1 break-words text-sm font-medium leading-6 text-slate-800">
                    {rideData?.destination || "Loading..."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              disabled={isRideCompleted}
              className="w-full rounded-[1.4rem] bg-slate-900 px-4 py-4 font-semibold text-white shadow-lg transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-500"
            >
              <span className="flex items-center justify-center gap-2">
                <i className="ri-phone-line"></i>
                Contact Captain
              </span>
            </button>

            <button
              onClick={() => navigate("/home")}
              className="w-full rounded-[1.4rem] border border-slate-200 bg-white px-4 py-4 font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
            >
              {isRideCompleted ? "Go to Home" : "Back to home"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Riding;
