import React, { useRef, useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { SocketContext } from "../context/SocketContext";
import { CaptainDataContext } from "../context/CaptainContext";
import { API_BASE_URL } from "../config/api";

const CaptainHome = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [activeStatsTab, setActiveStatsTab] = useState("today");
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState("");
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const [ride, setRide] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState("");
  const [incomingRideToast, setIncomingRideToast] = useState(null);

  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);

  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);

  useEffect(() => {
    if (!captain?._id) return;

    const fetchDashboardStats = async () => {
      try {
        setIsStatsLoading(true);
        setStatsError("");

        const response = await axios.get(
          `${API_BASE_URL}/captains/dashboard-stats`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        setDashboardStats(response.data);
      } catch (err) {
        console.error("Dashboard stats error:", err);
        setStatsError("Unable to load dashboard stats");
      } finally {
        setIsStatsLoading(false);
      }
    };

    fetchDashboardStats();
  }, [captain?._id]);

  // ✅ FIX: Proper socket connection and location updates with cleanup
  useEffect(() => {
    if (!socket || !captain?._id) return;

    const joinSocketRoom = () => {
      // Join socket room every time the socket reconnects so the backend always has the latest socketId.
      socket.emit("join", {
        userId: captain._id,
        userType: "captain",
      });
      console.log("✅ Captain joined socket room:", captain._id, socket.id);
    };

    // Location update function
    // Location update function
    // TEMP: send fixed location (Indore) so backend can find captain
    const updateLocation = () => {
      const fakeLocation = {
        lat: 22.7203616, // Indore
        lng: 75.8681996,
      };

      socket.emit("update-location-captain", {
        userId: captain._id,
        location: fakeLocation,
      });

      console.log("📍 Sent fake location for captain:", fakeLocation);
    };

    // Initial location update
    updateLocation();

    // Set interval for location updates every 10 seconds
    const locationInterval = setInterval(updateLocation, 10000);

    // Socket event listeners
    const handleNewRide = (data) => {
      console.log("🚗 New ride request:", data);
      setRide(data);
      setRidePopupPanel(true);
      setConfirmRidePopupPanel(false);
      setIncomingRideToast({
        title: "New ride request",
        pickup: data?.pickup,
        destination: data?.destination,
      });
    };

    const handleError = (error) => {
      console.error("❌ Socket error:", error);
      setError(error.message || "Something went wrong");
    };

    joinSocketRoom();

    socket.on("new-ride", handleNewRide);
    socket.on("error", handleError);
    socket.on("connect", joinSocketRoom);

    // ✅ Cleanup function
    return () => {
      clearInterval(locationInterval);
      socket.off("new-ride", handleNewRide);
      socket.off("error", handleError);
      socket.off("connect", joinSocketRoom);
    };
  }, [socket, captain]);

  useEffect(() => {
    if (!incomingRideToast) return;

    const timer = setTimeout(() => {
      setIncomingRideToast(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, [incomingRideToast]);

  // Confirm ride function
  const confirmRide = async () => {
    if (!ride?._id) {
      setError("Invalid ride data");
      return;
    }

    setError("");
    setIsConfirming(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/rides/confirm`,
        {
          rideId: ride._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      console.log("✅ Ride confirmed:", response.data);
      setRidePopupPanel(false);
      setConfirmRidePopupPanel(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to confirm ride");
      console.error("Ride confirmation error:", err);
    } finally {
      setIsConfirming(false);
    }
  };

  // GSAP Animations
  useGSAP(() => {
    if (ridePopupPanel) {
      gsap.to(ridePopupPanelRef.current, {
        transform: "translateY(0)",
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.to(ridePopupPanelRef.current, {
        transform: "translateY(100%)",
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [ridePopupPanel]);

  useGSAP(() => {
    if (confirmRidePopupPanel) {
      gsap.to(confirmRidePopupPanelRef.current, {
        transform: "translateY(0)",
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.to(confirmRidePopupPanelRef.current, {
        transform: "translateY(100%)",
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [confirmRidePopupPanel]);

  return (
    <div className="h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <div className="fixed top-0 z-20 flex items-center justify-between w-screen p-6">
        <img
          className="w-16 drop-shadow-lg"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt="Uber"
        />
        <Link
          to="/captain/logout"
          className="flex items-center justify-center w-10 h-10 transition-all bg-white rounded-full shadow-lg hover:bg-red-50"
        >
          <i className="text-lg font-medium text-red-500 ri-logout-box-r-line"></i>
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="fixed z-30 flex items-center gap-2 p-3 text-sm text-red-700 bg-red-100 border border-red-200 rounded-lg shadow-lg top-20 left-4 right-4">
          <i className="ri-error-warning-line"></i>
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="ml-auto text-red-700 hover:text-red-900"
          >
            <i className="ri-close-line"></i>
          </button>
        </div>
      )}

      {/* Incoming Ride Toast */}
      {incomingRideToast && (
        <div className="fixed top-20 left-4 right-4 z-[60] rounded-2xl border border-purple-200 bg-white shadow-2xl overflow-hidden">
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
              <i className="text-xl ri-taxi-line"></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{incomingRideToast.title}</p>
              <p className="mt-1 text-xs text-white/90 truncate">
                {incomingRideToast.pickup || "Pickup pending"}
              </p>
              <p className="text-xs text-white/90 truncate">
                {incomingRideToast.destination || "Destination pending"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIncomingRideToast(null)}
              className="rounded-full p-1 text-white/90 hover:bg-white/15 hover:text-white"
              aria-label="Dismiss ride toast"
            >
              <i className="ri-close-line text-lg"></i>
            </button>
          </div>
          <div className="px-4 py-3 text-sm text-gray-700 bg-white">
            Opened automatically. Review and accept the ride below.
          </div>
        </div>
      )}

      {/* Map Section */}
      <div className="h-3/5 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-white">
            <i className="text-6xl ri-roadster-line"></i>
            <p className="mt-4 text-xl font-semibold">Waiting for Rides</p>
            <p className="text-sm opacity-75">Your location is being tracked</p>
          </div>
        </div>
      </div>

      {/* Captain Details Section */}
      <div className="p-6 -mt-6 bg-white shadow-2xl h-2/5 rounded-t-3xl">
        <CaptainDetails
          captain={captain}
          dashboardStats={dashboardStats}
          activeStatsTab={activeStatsTab}
          setActiveStatsTab={setActiveStatsTab}
          isStatsLoading={isStatsLoading}
          statsError={statsError}
        />
      </div>

      {/* Ride Popup Overlay */}
      {ridePopupPanel && (
        <button
          type="button"
          onClick={() => setRidePopupPanel(false)}
          className="fixed inset-0 z-[45] bg-black/30 backdrop-blur-[2px]"
          aria-label="Close ride popup overlay"
        />
      )}

      {/* Ride Popup Panel */}
      <div
        ref={ridePopupPanelRef}
        className="fixed bottom-0 z-[50] w-full px-3 py-10 pt-12 translate-y-full bg-white shadow-2xl rounded-t-3xl"
      >
        <RidePopUp
          ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          confirmRide={confirmRide}
          isConfirming={isConfirming}
        />
      </div>

      {/* Confirm Ride Popup Panel */}
      <div
        ref={confirmRidePopupPanelRef}
        className="fixed bottom-0 z-[55] w-full h-screen px-3 py-10 pt-12 translate-y-full bg-white"
      >
        <ConfirmRidePopUp
          ride={ride}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          setRidePopupPanel={setRidePopupPanel}
        />
      </div>
    </div>
  );
};

export default CaptainHome;
