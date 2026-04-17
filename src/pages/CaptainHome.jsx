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

    const updateLocation = () => {
      if (!navigator.geolocation) {
        console.warn("Geolocation is not supported in this browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const liveLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          socket.emit("update-location-captain", {
            userId: captain._id,
            location: liveLocation,
          });

          console.log("📍 Sent live location for captain:", liveLocation);
        },
        (geoError) => {
          console.error("Failed to get captain location:", geoError.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5000,
        },
      );
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

    const handleRideAccepted = (data) => {
      console.log("✅ Ride accepted by another captain:", data);
      if (ride?._id === data.rideId) {
        console.log(
          "Dismissing popup - ride was accepted by",
          data.captainName,
        );
        setRide(null);
        setRidePopupPanel(false);
        setConfirmRidePopupPanel(false);
        setIncomingRideToast({
          title: "Ride taken",
          pickup: `${data.captainName} accepted this ride`,
          destination: "",
        });
      }
    };

    const handleError = (error) => {
      console.error("❌ Socket error:", error);
      setError(error.message || "Something went wrong");
    };

    joinSocketRoom();

    socket.on("new-ride", handleNewRide);
    socket.on("ride-accepted", handleRideAccepted);
    socket.on("error", handleError);
    socket.on("connect", joinSocketRoom);

    // ✅ Cleanup function
    return () => {
      clearInterval(locationInterval);
      socket.off("new-ride", handleNewRide);
      socket.off("ride-accepted", handleRideAccepted);
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
    <div className="screen-base screen-captain">
      <div className="aurora-backdrop" />

      <div className="top-nav fixed inset-x-0 top-0 z-20 px-5 pt-5">
        <img
          className="w-16 drop-shadow-sm"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt="Uber"
        />
        <Link
          to="/captain/logout"
          className="icon-btn border-red-100 bg-red-500 text-white hover:bg-red-600"
        >
          <i className="ri-logout-box-r-line text-lg font-medium"></i>
        </Link>
      </div>

      {error && (
        <div className="alert-error fixed left-4 right-4 top-20 z-30">
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

      {incomingRideToast && (
        <div className="fixed left-4 right-4 top-20 z-[60] overflow-hidden rounded-2xl border border-violet-200 bg-white shadow-2xl">
          <div className="flex items-start gap-3 bg-gradient-to-r from-violet-600 to-indigo-600 p-4 text-white">
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
          <div className="bg-white px-4 py-3 text-sm text-slate-700">
            Opened automatically. Review and accept the ride below.
          </div>
        </div>
      )}

      <div className="h-3/5 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500">
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-white">
            <i className="text-6xl ri-roadster-line"></i>
            <p className="mt-4 text-xl font-semibold">Waiting for Rides</p>
            <p className="text-sm opacity-80">Your location is being tracked</p>
          </div>
        </div>
      </div>

      <div className="sheet-panel h-2/5 -mt-6 p-5 pt-6 sm:px-6">
        <CaptainDetails
          captain={captain}
          dashboardStats={dashboardStats}
          activeStatsTab={activeStatsTab}
          setActiveStatsTab={setActiveStatsTab}
          isStatsLoading={isStatsLoading}
          statsError={statsError}
        />
      </div>

      {ridePopupPanel && (
        <button
          type="button"
          onClick={() => setRidePopupPanel(false)}
          className="fixed inset-0 z-[45] bg-black/30 backdrop-blur-[2px]"
          aria-label="Close ride popup overlay"
        />
      )}

      <div
        ref={ridePopupPanelRef}
        className="sheet-panel fixed bottom-0 z-[50] w-full translate-y-full px-3 py-8 pt-11"
      >
        <RidePopUp
          ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          confirmRide={confirmRide}
          isConfirming={isConfirming}
        />
      </div>

      <div
        ref={confirmRidePopupPanelRef}
        className="sheet-panel fixed bottom-0 z-[55] h-screen w-full translate-y-full px-3 py-8 pt-11"
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
