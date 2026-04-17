import React, { useEffect, useState } from "react";

const WaitingForDriver = (props) => {
  const [copyStatus, setCopyStatus] = useState("");
  const [dotCount, setDotCount] = useState(1);

  const captainName =
    `${props.ride?.captain?.fullname?.firstname || "Captain"} ${props.ride?.captain?.fullname?.lastname || ""}`.trim();

  const vehicleType = props.ride?.captain?.vehicle?.vehicleType || "vehicle";
  const vehicleColor = props.ride?.captain?.vehicle?.color || "";
  const vehiclePlate = props.ride?.captain?.vehicle?.plate || "N/A";

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDotCount((current) => (current >= 3 ? 1 : current + 1));
    }, 650);

    return () => window.clearInterval(timer);
  }, []);

  const animatedDots = ".".repeat(dotCount);

  const handleCopyOtp = async () => {
    if (!props.ride?.otp) return;

    try {
      await navigator.clipboard.writeText(String(props.ride.otp));
      setCopyStatus("Copied");
      window.setTimeout(() => setCopyStatus(""), 2000);
    } catch {
      setCopyStatus("Copy failed");
      window.setTimeout(() => setCopyStatus(""), 2000);
    }
  };

  return (
    <div className="relative flex h-[78vh] flex-col">
      <button
        className="absolute left-0 right-0 top-0 z-20 flex justify-center p-2"
        onClick={() => props.setWaitingForDriver(false)}
      >
        <i className="ri-arrow-down-wide-line text-3xl text-gray-400"></i>
      </button>

      <div className="mt-8 flex-1 overflow-y-auto pb-28">
        <div className="mb-4 overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 px-4 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white shadow-sm">
                <i className="ri-taxi-line text-xl"></i>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90">
                  Ride accepted
                </p>
                <h3 className="mt-1 text-lg font-bold leading-tight text-white sm:text-xl">
                  {captainName} is coming to your location
                </h3>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-white/90">
              <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-white"></span>
              <span>Driver arriving soon{animatedDots}</span>
            </div>
          </div>

          <div className="px-4 py-4">
            <p className="text-sm leading-6 text-gray-700">
              {props.rideStatusMessage ||
                "Your captain has accepted the ride. Please wait a few minutes and share the OTP when the driver arrives."}
            </p>

            <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3">
              <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                <span>Arrival status</span>
                <span>Live</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500"></div>
              </div>
              <p className="mt-3 text-xs text-gray-600">
                Keep your phone ready and share the OTP only when the driver
                reaches you.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <i className="ri-user-smile-line text-2xl"></i>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                  Driver
                </p>
                <h2 className="mt-1 truncate text-base font-bold capitalize text-gray-900">
                  {captainName}
                </h2>
                <p className="truncate text-sm capitalize text-gray-600">
                  {vehicleColor} {vehicleType}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
              Vehicle number
            </p>
            <h4 className="mt-2 text-xl font-bold tracking-wide text-gray-900">
              {vehiclePlate}
            </h4>
            <p className="mt-1 text-sm capitalize text-gray-600">
              {vehicleColor} {vehicleType}
            </p>
          </div>
        </div>

        <div className="mb-4 rounded-3xl border border-purple-200 bg-gradient-to-br from-purple-50 via-white to-violet-50 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3 text-left">
            <div>
              <p className="text-sm font-semibold text-gray-800">Your OTP</p>
              <p className="text-xs text-gray-600">
                Share only after captain arrives
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyOtp}
              className="rounded-full border border-purple-200 bg-white px-3 py-1.5 text-xs font-semibold text-purple-700 transition-all hover:bg-purple-50"
            >
              Copy OTP
            </button>
          </div>

          <h1 className="mt-1 text-center text-4xl font-extrabold tracking-[0.28em] text-purple-700 sm:text-5xl">
            {props.ride?.otp}
          </h1>

          <p className="mt-3 text-center text-sm text-gray-700">
            Keep this code ready. Captain will verify it before the trip starts.
          </p>
          {copyStatus && (
            <p className="mt-2 text-center text-xs font-semibold text-purple-700">
              {copyStatus}
            </p>
          )}
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
              Route details
            </p>
            <p className="text-xs text-gray-400">Trip summary</p>
          </div>

          <div className="relative space-y-4 pl-2">
            <div className="absolute bottom-2 left-[11px] top-2 w-px bg-gradient-to-b from-green-500 via-gray-300 to-red-500"></div>

            <div className="relative flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white shadow-sm">
                <i className="ri-map-pin-user-fill text-xs"></i>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                  Pickup
                </p>
                <p className="mt-0.5 break-words text-sm font-medium text-gray-900">
                  {props.ride?.pickup}
                </p>
              </div>
            </div>

            <div className="relative flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-sm">
                <i className="ri-flag-2-fill text-xs"></i>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                  Destination
                </p>
                <p className="mt-0.5 break-words text-sm font-medium text-gray-900">
                  {props.ride?.destination}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
              Fare
            </p>
            <p className="mt-1 text-2xl font-bold text-emerald-700">
              ₹{props.ride?.fare}
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 bg-white/95 px-1 pt-3 backdrop-blur-sm">
        <button className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 p-4 font-semibold text-white shadow-lg transition-all hover:from-emerald-600 hover:to-green-700">
          <i className="ri-phone-line mr-2"></i>
          Contact Driver
        </button>
      </div>
    </div>
  );
};

export default WaitingForDriver;
