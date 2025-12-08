import React, { useRef, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import "remixicon/fonts/remixicon.css";

import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import { SocketContext } from "../context/SocketContext";
import { UserDataContext } from "../context/UserContext";

const Home = () => {
  // Form states
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);

  // Panel states
  const [panelOpen, setPanelOpen] = useState(false); // controls suggestions visibility
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);

  // Ride data
  const [fare, setFare] = useState({});
  const [vehicleType, setVehicleType] = useState(null);
  const [ride, setRide] = useState(null);

  // Loading & error
  const [isLoadingFare, setIsLoadingFare] = useState(false);
  const [isCreatingRide, setIsCreatingRide] = useState(false);
  const [error, setError] = useState("");

  // Refs for GSAP animations for lower panels
  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);

  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);

  // Socket: join room and listen for ride events
  useEffect(() => {
    if (!socket || !user?._id) return;

    socket.emit("join", { userType: "user", userId: user._id });
    console.log("✅ User joined socket room:", user._id);

    const handleRideConfirmed = (confirmedRide) => {
      console.log("🚗 Ride confirmed:", confirmedRide);
      setRide(confirmedRide);
      setVehicleFound(false);
      setWaitingForDriver(true);
    };

    const handleRideStarted = (startedRide) => {
      console.log("🏁 Ride started:", startedRide);
      setWaitingForDriver(false);
      navigate("/riding", { state: { ride: startedRide } });
    };

    const handleError = (err) => {
      console.error("❌ Socket error:", err);
      setError(err.message || "Something went wrong");
    };

    socket.on("ride-confirmed", handleRideConfirmed);
    socket.on("ride-started", handleRideStarted);
    socket.on("error", handleError);

    return () => {
      socket.off("ride-confirmed", handleRideConfirmed);
      socket.off("ride-started", handleRideStarted);
      socket.off("error", handleError);
    };
  }, [socket, user, navigate]);

  // Debounced suggestion fetch for pickup
  useEffect(() => {
    if (!pickup || pickup.length < 3) {
      setPickupSuggestions([]);
      return;
    }

    const t = setTimeout(() => {
      fetchSuggestions(pickup, "pickup");
    }, 300);

    return () => clearTimeout(t);
  }, [pickup]);

  // Debounced suggestion fetch for destination
  useEffect(() => {
    if (!destination || destination.length < 3) {
      setDestinationSuggestions([]);
      return;
    }

    const t = setTimeout(() => {
      fetchSuggestions(destination, "destination");
    }, 300);

    return () => clearTimeout(t);
  }, [destination]);

  // Fetch suggestions from backend
  const fetchSuggestions = async (input, type) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { input },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (type === "pickup") {
        setPickupSuggestions(res.data);
      } else {
        setDestinationSuggestions(res.data);
      }
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  // Get fare
  const findTrip = async () => {
    if (!pickup || !destination) {
      setError("Please enter both pickup and destination");
      return;
    }

    setError("");
    setIsLoadingFare(true);

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
        {
          params: { pickup, destination },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setFare(res.data);
      setVehiclePanel(true);
      // we can close suggestions once we move to vehicle selection
      setPanelOpen(false);
    } catch (err) {
      console.error("Fare calculation error:", err);
      setError(err.response?.data?.message || "Failed to calculate fare");
    } finally {
      setIsLoadingFare(false);
    }
  };

  // Create ride
  const createRide = async () => {
    if (!vehicleType) {
      setError("Please select a vehicle type");
      return;
    }

    setError("");
    setIsCreatingRide(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/create`,
        { pickup, destination, vehicleType },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("✅ Ride created:", res.data);
      setConfirmRidePanel(false);
      setVehicleFound(true);
    } catch (err) {
      console.error("Ride creation error:", err);
      setError(err.response?.data?.message || "Failed to create ride");
    } finally {
      setIsCreatingRide(false);
    }
  };

  // GSAP: slide-up panels
  useGSAP(() => {
    const el = vehiclePanelRef.current;
    if (!el) return;
    gsap.to(el, {
      transform: vehiclePanel ? "translateY(0)" : "translateY(100%)",
      duration: 0.3,
      ease: "power2.inOut",
    });
  }, [vehiclePanel]);

  useGSAP(() => {
    const el = confirmRidePanelRef.current;
    if (!el) return;
    gsap.to(el, {
      transform: confirmRidePanel ? "translateY(0)" : "translateY(100%)",
      duration: 0.3,
      ease: "power2.inOut",
    });
  }, [confirmRidePanel]);

  useGSAP(() => {
    const el = vehicleFoundRef.current;
    if (!el) return;
    gsap.to(el, {
      transform: vehicleFound ? "translateY(0)" : "translateY(100%)",
      duration: 0.3,
      ease: "power2.inOut",
    });
  }, [vehicleFound]);

  useGSAP(() => {
    const el = waitingForDriverRef.current;
    if (!el) return;
    gsap.to(el, {
      transform: waitingForDriver ? "translateY(0)" : "translateY(100%)",
      duration: 0.3,
      ease: "power2.inOut",
    });
  }, [waitingForDriver]);

  useEffect(() => {
    // If both fields have some value, hide the suggestion panel
    if (pickup && destination) {
      setPanelOpen(false);
    }
  }, [pickup, destination]);

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="absolute z-20 flex items-center justify-between w-full px-5 top-5">
        <img
          className="w-16 drop-shadow-lg"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt="Uber"
        />
        <button
          onClick={() => navigate("/user/logout")}
          className="p-2 text-white transition-all bg-red-500 rounded-full shadow-lg hover:bg-red-600"
        >
          <i className="text-xl ri-logout-box-r-line"></i>
        </button>
      </div>

      {/* Map placeholder */}
      <div className="w-screen h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-white">
            <i className="text-6xl ri-map-pin-line"></i>
            <p className="mt-4 text-xl font-semibold">Map View</p>
            <p className="text-sm opacity-75">Integration coming soon</p>
          </div>
        </div>
      </div>

      {/* Bottom sheet with inputs + suggestions + button */}
      <div className="absolute top-0 flex flex-col justify-end w-full h-screen pointer-events-none">
        <div className="pointer-events-auto max-h-[70%] rounded-t-3xl bg-white p-6 shadow-2xl overflow-y-auto">
          <h4 className="text-2xl font-bold text-gray-900">Find a trip</h4>

          {error && (
            <div className="flex items-center gap-2 p-3 mt-3 text-sm text-red-700 bg-red-100 border border-red-200 rounded-lg">
              <i className="ri-error-warning-line"></i>
              <span>{error}</span>
            </div>
          )}

          <form className="relative py-3" onSubmit={submitHandler}>
            <div className="pointer-events-none absolute left-5 top-1/2 h-16 w-[2px] -translate-y-1/2 rounded-full bg-gray-700" />

            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField("pickup");
              }}
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="w-full px-12 py-3 text-base transition-all bg-gray-100 border-2 border-transparent rounded-xl focus:border-purple-500 focus:outline-none"
              type="text"
              placeholder="Add a pick-up location"
            />

            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField("destination");
              }}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-12 py-3 mt-3 text-base transition-all bg-gray-100 border-2 border-transparent rounded-xl focus:border-purple-500 focus:outline-none"
              type="text"
              placeholder="Enter your destination"
            />
          </form>

          {/* Suggestions live here, above the button */}
          {panelOpen && (
            <div className="mt-1 overflow-y-auto bg-white border border-gray-200 max-h-40 rounded-xl">
              <LocationSearchPanel
                suggestions={
                  activeField === "pickup"
                    ? pickupSuggestions
                    : destinationSuggestions
                }
                setPanelOpen={setPanelOpen}
                setPickup={setPickup}
                setDestination={setDestination}
                activeField={activeField}
              />
            </div>
          )}

          <button
            onClick={findTrip}
            disabled={isLoadingFare || !pickup || !destination}
            className="flex items-center justify-center w-full px-4 py-3 mt-3 font-semibold text-white transition-all bg-black rounded-xl hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isLoadingFare ? (
              <>
                <i className="mr-2 ri-loader-4-line animate-spin"></i>
                Calculating...
              </>
            ) : (
              "Find Trip"
            )}
          </button>
        </div>
      </div>

      {/* Vehicle selection panel */}
      <div
        ref={vehiclePanelRef}
        className="fixed bottom-0 z-10 w-full px-3 py-10 pt-12 translate-y-full bg-white shadow-2xl rounded-t-3xl"
      >
        <VehiclePanel
          selectVehicle={setVehicleType}
          fare={fare}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehiclePanel={setVehiclePanel}
        />
      </div>

      {/* Confirm ride panel */}
      <div
        ref={confirmRidePanelRef}
        className="fixed bottom-0 z-10 w-full px-3 py-6 pt-12 translate-y-full bg-white shadow-2xl rounded-t-3xl"
      >
        <ConfirmRide
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehicleFound={setVehicleFound}
          isCreatingRide={isCreatingRide}
        />
      </div>

      {/* Looking for driver panel */}
      <div
        ref={vehicleFoundRef}
        className="fixed bottom-0 z-10 w-full px-3 py-6 pt-12 translate-y-full bg-white shadow-2xl rounded-t-3xl"
      >
        <LookingForDriver
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          setVehicleFound={setVehicleFound}
        />
      </div>

      {/* Waiting for driver panel */}
      <div
        ref={waitingForDriverRef}
        className="fixed bottom-0 z-10 w-full px-3 py-6 pt-12 translate-y-full bg-white shadow-2xl rounded-t-3xl"
      >
        <WaitingForDriver
          ride={ride}
          setVehicleFound={setVehicleFound}
          setWaitingForDriver={setWaitingForDriver}
          waitingForDriver={waitingForDriver}
        />
      </div>
    </div>
  );
};

export default Home;
