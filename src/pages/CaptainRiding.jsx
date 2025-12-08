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
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <i className="text-6xl text-green-600 ri-loader-4-line animate-spin"></i>
          <p className="mt-4 text-lg font-medium text-gray-700">
            Loading ride...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col justify-end h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <div className="fixed top-0 z-20 flex items-center justify-between w-screen p-6">
        <img
          className="w-16 drop-shadow-lg"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt="Uber"
        />
        <Link
          to="/captain-home"
          className="flex items-center justify-center w-10 h-10 transition-all bg-white rounded-full shadow-lg hover:bg-gray-100"
        >
          <i className="text-lg font-medium ri-home-line"></i>
        </Link>
      </div>

      {/* Map Section */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-center text-white">
            <i className="text-6xl ri-navigation-line animate-pulse"></i>
            <p className="mt-4 text-xl font-semibold">
              En Route to Destination
            </p>

            {/* Passenger Info on Map */}
            <div className="max-w-xs p-4 mt-8 bg-white rounded-lg shadow-lg bg-opacity-90">
              <h4 className="font-semibold text-gray-900 capitalize">
                {rideData?.user?.fullname?.firstname || "Passenger"}{" "}
                {rideData?.user?.fullname?.lastname || ""}
              </h4>
              <p className="mt-3 text-sm font-medium text-gray-700">📍 From</p>
              <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                {rideData?.pickup || "Loading..."}
              </p>

              <p className="mt-3 text-sm font-medium text-gray-700">🎯 To</p>
              <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                {rideData?.destination || "Loading..."}
              </p>

              {rideData?.fare && (
                <div className="pt-3 mt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-600">Estimated Fare</p>
                  <p className="mt-1 text-lg font-bold text-green-600">
                    ₹{rideData.fare}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div
        className="relative z-10 flex items-center justify-between p-6 pt-10 transition-all shadow-2xl cursor-pointer bg-gradient-to-r from-yellow-400 to-orange-400 h-1/5 rounded-t-3xl hover:from-yellow-500 hover:to-orange-500"
        onClick={() => setFinishRidePanel(true)}
      >
        <div
          className="absolute left-0 right-0 flex justify-center -top-3"
          onClick={(e) => {
            e.stopPropagation();
            setFinishRidePanel(true);
          }}
        >
          <div className="flex items-center justify-center w-12 h-6 bg-white rounded-full shadow-lg">
            <i className="text-xl text-gray-700 ri-arrow-up-wide-line"></i>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg">
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
          className="px-6 py-3 font-semibold text-white transition-all bg-green-600 rounded-lg shadow-lg hover:bg-green-700 active:scale-95"
        >
          Complete Ride
        </button>
      </div>

      {/* Finish Ride Panel */}
      <div
        ref={finishRidePanelRef}
        className="fixed w-full z-[500] bottom-0 translate-y-full bg-white px-3 py-10 pt-12 rounded-t-3xl shadow-2xl"
      >
        <FinishRide ride={rideData} setFinishRidePanel={setFinishRidePanel} />
      </div>
    </div>
  );
};

export default CaptainRiding;
