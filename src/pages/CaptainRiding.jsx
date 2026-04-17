import React, { useRef, useState, useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import FinishRide from "../components/FinishRide";
import { SocketContext } from "../context/SocketContext";

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const [rideData, setRideData] = useState(null);

  const finishRidePanelRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);

  const initialRideData = location.state?.ride;

  // Initialize ride data
  useEffect(() => {
    if (!initialRideData) {
      navigate("/captain-home");
      return;
    }
    setRideData(initialRideData);
  }, [initialRideData, navigate]);

  // Socket listener for ride completion
  useEffect(() => {
    if (!socket || !rideData) return;

    const handleRideEnded = () => {
      console.log("🏁 Ride ended by user");
      setFinishRidePanel(false);
      setTimeout(() => {
        navigate("/captain-home");
      }, 2000);
    };

    const handleRideUpdated = (updatedRide) => {
      console.log("📍 Ride updated:", updatedRide);
      setRideData(updatedRide);
    };

    socket.on("ride-ended", handleRideEnded);
    socket.on("ride-updated", handleRideUpdated);

    return () => {
      socket.off("ride-ended", handleRideEnded);
      socket.off("ride-updated", handleRideUpdated);
    };
  }, [socket, rideData, navigate]);

  // GSAP Animation
  useGSAP(() => {
    if (finishRidePanel) {
      gsap.to(finishRidePanelRef.current, {
        transform: "translateY(0)",
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.to(finishRidePanelRef.current, {
        transform: "translateY(100%)",
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [finishRidePanel]);

  if (!rideData) {
    return (
      <div className="screen-base screen-captain flex items-center justify-center">
        <div className="aurora-backdrop" />
        <div className="panel-card relative z-10 w-[min(92vw,420px)] p-8 text-center">
          <i className="ri-loader-4-line animate-spin text-6xl text-emerald-600"></i>
          <p className="mt-4 text-lg font-medium text-slate-700">
            Loading ride...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-base screen-captain flex flex-col justify-end">
      <div className="aurora-backdrop" />

      <div className="top-nav fixed inset-x-0 top-0 z-20 px-5 pt-5">
        <img
          className="w-16 drop-shadow-sm"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt="Uber"
        />
        <Link to="/captain-home" className="icon-btn">
          <i className="ri-home-line text-lg font-medium"></i>
        </Link>
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-center text-white">
            <i className="text-6xl ri-navigation-line animate-pulse"></i>
            <p className="mt-4 text-xl font-semibold">
              En Route to Destination
            </p>

            <div className="mt-8 max-w-xs rounded-2xl border border-white/40 bg-white/90 p-4 text-left shadow-lg backdrop-blur-sm">
              <h4 className="font-semibold capitalize text-slate-900">
                {rideData?.user?.fullname?.firstname || "Passenger"}{" "}
                {rideData?.user?.fullname?.lastname || ""}
              </h4>
              <p className="mt-3 text-sm font-medium text-slate-700">📍 From</p>
              <p className="mt-1 line-clamp-2 text-xs text-slate-600">
                {rideData?.pickup || "Loading..."}
              </p>

              <p className="mt-3 text-sm font-medium text-slate-700">🎯 To</p>
              <p className="mt-1 line-clamp-2 text-xs text-slate-600">
                {rideData?.destination || "Loading..."}
              </p>

              {rideData?.fare && (
                <div className="mt-4 border-t border-slate-200 pt-3">
                  <p className="text-xs text-slate-600">Estimated Fare</p>
                  <p className="mt-1 text-lg font-bold text-green-600">
                    ₹{rideData.fare}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className="sheet-panel relative z-10 flex h-1/5 cursor-pointer items-center justify-between bg-gradient-to-r from-amber-400 to-orange-400 p-6 pt-10 transition-all hover:from-amber-500 hover:to-orange-500"
        onClick={() => setFinishRidePanel(true)}
      >
        <div
          className="absolute left-0 right-0 flex justify-center -top-3"
          onClick={(e) => {
            e.stopPropagation();
            setFinishRidePanel(true);
          }}
        >
          <div className="flex h-6 w-12 items-center justify-center rounded-full bg-white shadow-lg">
            <i className="ri-arrow-up-wide-line text-xl text-slate-700"></i>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg">
            <i className="text-2xl text-orange-600 ri-map-pin-line"></i>
          </div>
          <div>
            <h4 className="text-xl font-bold text-white">En Route</h4>
            <p className="text-sm text-white opacity-90">
              Tap to complete ride
            </p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setFinishRidePanel(true);
          }}
          className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-emerald-700 active:scale-95"
        >
          Complete Ride
        </button>
      </div>

      <div
        ref={finishRidePanelRef}
        className="sheet-panel fixed bottom-0 z-[500] w-full translate-y-full px-3 py-8 pt-11"
      >
        <FinishRide ride={rideData} setFinishRidePanel={setFinishRidePanel} />
      </div>
    </div>
  );
};

export default CaptainRiding;
