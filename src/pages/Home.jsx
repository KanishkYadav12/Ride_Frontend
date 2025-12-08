import React, { useEffect, useRef, useState, useContext } from "react";
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
  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);

  // Ride data
  const [fare, setFare] = useState({});
  const [vehicleType, setVehicleType] = useState(null);
  const [ride, setRide] = useState(null);

  // Loading & error states
  const [isLoadingFare, setIsLoadingFare] = useState(false);
  const [isCreatingRide, setIsCreatingRide] = useState(false);
  const [error, setError] = useState("");

  // Refs for GSAP animations
  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);

  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);

  // ✅ FIX: Socket connection and listeners in useEffect with cleanup
  useEffect(() => {
    if (!socket || !user?._id) return;

    // Join socket room
    socket.emit("join", { userType: "user", userId: user._id });
    console.log("✅ User joined socket room:", user._id);

    // Socket event listeners
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

    const handleError = (error) => {
      console.error("❌ Socket error:", error);
      setError(error.message || "Something went wrong");
    };

    // Attach listeners
    socket.on("ride-confirmed", handleRideConfirmed);
    socket.on("ride-started", handleRideStarted);
    socket.on("error", handleError);

    // ✅ Cleanup function
    return () => {
      socket.off("ride-confirmed", handleRideConfirmed);
      socket.off("ride-started", handleRideStarted);
      socket.off("error", handleError);
    };
  }, [socket, user, navigate]);

  // Debounced suggestion fetch
  useEffect(() => {
    if (!pickup || pickup.length < 3) {
      setPickupSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      fetchSuggestions(pickup, "pickup");
    }, 300);

    return () => clearTimeout(timer);
  }, [pickup]);

  useEffect(() => {
    if (!destination || destination.length < 3) {
      setDestinationSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      fetchSuggestions(destination, "destination");
    }, 300);

    return () => clearTimeout(timer);
  }, [destination]);

  // Fetch location suggestions
  const fetchSuggestions = async (input, type) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { input },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (type === "pickup") {
        setPickupSuggestions(response.data);
      } else {
        setDestinationSuggestions(response.data);
      }
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  // Handle form submission
  const submitHandler = (e) => {
    e.preventDefault();
  };

  // Find trip and get fare
  const findTrip = async () => {
    if (!pickup || !destination) {
      setError("Please enter both pickup and destination");
      return;
    }

    setError("");
    setIsLoadingFare(true);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
        {
          params: { pickup, destination },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setFare(response.data);
      setVehiclePanel(true);
      setPanelOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to calculate fare");
      console.error("Fare calculation error:", err);
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
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/create`,
        {
          pickup,
          destination,
          vehicleType,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("✅ Ride created:", response.data);
      setConfirmRidePanel(false);
      setVehicleFound(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create ride");
      console.error("Ride creation error:", err);
    } finally {
      setIsCreatingRide(false);
    }
  };

  // GSAP Animations
  useGSAP(() => {
    if (panelOpen) {
      gsap.to(panelRef.current, {
        height: "70%",
        padding: 24,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(panelCloseRef.current, {
        opacity: 1,
        duration: 0.2,
      });
    } else {
      gsap.to(panelRef.current, {
        height: "0%",
        padding: 0,
        duration: 0.3,
        ease: "power2.in",
      });
      gsap.to(panelCloseRef.current, {
        opacity: 0,
        duration: 0.2,
      });
    }
  }, [panelOpen]);

  useGSAP(() => {
    if (vehiclePanel) {
      gsap.to(vehiclePanelRef.current, {
        transform: "translateY(0)",
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.to(vehiclePanelRef.current, {
        transform: "translateY(100%)",
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [vehiclePanel]);

  useGSAP(() => {
    if (confirmRidePanel) {
      gsap.to(confirmRidePanelRef.current, {
        transform: "translateY(0)",
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.to(confirmRidePanelRef.current, {
        transform: "translateY(100%)",
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [confirmRidePanel]);

  useGSAP(() => {
    if (vehicleFound) {
      gsap.to(vehicleFoundRef.current, {
        transform: "translateY(0)",
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.to(vehicleFoundRef.current, {
        transform: "translateY(100%)",
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [vehicleFound]);

  useGSAP(() => {
    if (waitingForDriver) {
      gsap.to(waitingForDriverRef.current, {
        transform: "translateY(0)",
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.to(waitingForDriverRef.current, {
        transform: "translateY(100%)",
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [waitingForDriver]);

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

      {/* Map Placeholder */}
      <div className="w-screen h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-white">
            <i className="text-6xl ri-map-pin-line"></i>
            <p className="mt-4 text-xl font-semibold">Map View</p>
            <p className="text-sm opacity-75">Integration coming soon</p>
          </div>
        </div>
      </div>

      {/* Main Panel */}
      <div className="absolute top-0 flex flex-col justify-end w-full h-screen pointer-events-none">
        <div className="h-[30%] p-6 bg-white rounded-t-3xl shadow-2xl pointer-events-auto">
          {/* Close button */}
          <button
            ref={panelCloseRef}
            onClick={() => setPanelOpen(false)}
            className="absolute text-2xl text-gray-600 opacity-0 right-6 top-6 hover:text-gray-800"
          >
            <i className="ri-arrow-down-wide-line"></i>
          </button>

          <h4 className="text-2xl font-bold text-gray-900">Find a trip</h4>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 p-3 mt-3 text-sm text-red-700 bg-red-100 border border-red-200 rounded-lg">
              <i className="ri-error-warning-line"></i>
              <span>{error}</span>
            </div>
          )}

          <form className="relative py-3" onSubmit={submitHandler}>
            <div className="absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>

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

          <button
            onClick={findTrip}
            disabled={isLoadingFare || !pickup || !destination}
            className="w-full px-4 py-3 mt-3 font-semibold text-white transition-all bg-black rounded-xl hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoadingFare ? (
              <span className="flex items-center justify-center gap-2">
                <i className="ri-loader-4-line animate-spin"></i>
                Calculating...
              </span>
            ) : (
              "Find Trip"
            )}
          </button>
        </div>

        {/* Location Search Panel */}
        <div
          ref={panelRef}
          className="h-0 overflow-hidden bg-white pointer-events-auto"
        >
          <LocationSearchPanel
            suggestions={
              activeField === "pickup"
                ? pickupSuggestions
                : destinationSuggestions
            }
            setPanelOpen={setPanelOpen}
            setVehiclePanel={setVehiclePanel}
            setPickup={setPickup}
            setDestination={setDestination}
            activeField={activeField}
          />
        </div>
      </div>

      {/* Vehicle Selection Panel */}
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

      {/* Confirm Ride Panel */}
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

      {/* Looking for Driver Panel */}
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

      {/* Waiting for Driver Panel */}
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
