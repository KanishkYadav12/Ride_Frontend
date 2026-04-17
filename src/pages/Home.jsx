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
import { API_BASE_URL } from "../config/api";

const Home = () => {
  const sheetRef = useRef(null);
  const pickupRequestRef = useRef(null);
  const destinationRequestRef = useRef(null);

  // Form states
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState("");

  // Panel states
  const [panelOpen, setPanelOpen] = useState(false); // controls suggestions visibility
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [rideStatusMessage, setRideStatusMessage] = useState("");
  const [activeRideRequestId, setActiveRideRequestId] = useState(null);

  // Ride data
  const [fare, setFare] = useState({});
  const [vehicleType, setVehicleType] = useState(null);
  const [ride, setRide] = useState(null);
  const showWaitingPanel =
    waitingForDriver && Boolean(ride?._id) && ride?.status === "accepted";

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

    const joinSocketRoom = () => {
      socket.emit("join", { userType: "user", userId: user._id });
      console.log("✅ User joined socket room:", user._id, socket.id);
    };

    const handleRideConfirmed = (confirmedRide) => {
      console.log("🚗 Ride confirmed:", confirmedRide);

      if (!confirmedRide?._id) {
        return;
      }

      if (!activeRideRequestId || confirmedRide._id !== activeRideRequestId) {
        console.log(
          "ℹ️ Ignoring ride-confirmed for unrelated ride:",
          confirmedRide._id,
        );
        return;
      }

      setRide(confirmedRide);
      setVehicleFound(false);
      setWaitingForDriver(true);
      setRideStatusMessage(
        `${confirmedRide?.captain?.fullname?.firstname || "Your captain"} accepted your ride and is coming to your location. Please wait a few minutes and share the OTP on arrival.`,
      );
    };

    const handleRideStarted = (startedRide) => {
      console.log("🏁 Ride started:", startedRide);
      setWaitingForDriver(false);
      setRideStatusMessage("");
      setActiveRideRequestId(null);
      navigate("/riding", { state: { ride: startedRide } });
    };

    const handleError = (err) => {
      console.error("❌ Socket error:", err);
      setError(err.message || "Something went wrong");
    };

    joinSocketRoom();

    socket.on("ride-confirmed", handleRideConfirmed);
    socket.on("ride-started", handleRideStarted);
    socket.on("error", handleError);
    socket.on("connect", joinSocketRoom);

    return () => {
      socket.off("ride-confirmed", handleRideConfirmed);
      socket.off("ride-started", handleRideStarted);
      socket.off("error", handleError);
      socket.off("connect", joinSocketRoom);
    };
  }, [socket, user, navigate, activeRideRequestId]);

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

  const closeSuggestions = () => {
    setPanelOpen(false);
    setActiveField(null);
    setSuggestionsError("");
  };

  const handleLocationChange = (field, value) => {
    if (field === "pickup") {
      setPickup(value);
    } else {
      setDestination(value);
    }

    setActiveField(field);
    setPanelOpen(true);
  };

  // Fetch suggestions from backend
  const fetchSuggestions = async (input, type) => {
    const query = input.trim();

    if (query.length < 3) {
      if (type === "pickup") {
        setPickupSuggestions([]);
      } else {
        setDestinationSuggestions([]);
      }
      setSuggestionsError("");
      return;
    }

    const activeRequestRef =
      type === "pickup" ? pickupRequestRef : destinationRequestRef;

    if (activeRequestRef.current) {
      activeRequestRef.current.abort();
    }

    const controller = new AbortController();
    activeRequestRef.current = controller;

    try {
      setIsSuggestionsLoading(true);
      setSuggestionsError("");

      const res = await axios.get(`${API_BASE_URL}/maps/get-suggestions`, {
        params: { input: query },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        signal: controller.signal,
      });

      if (type === "pickup") {
        setPickupSuggestions(res.data);
      } else {
        setDestinationSuggestions(res.data);
      }
    } catch (err) {
      if (err.name === "CanceledError" || err.name === "AbortError") {
        return;
      }

      console.error("Error fetching suggestions:", err);
      setSuggestionsError("Unable to load suggestions right now.");
      if (type === "pickup") {
        setPickupSuggestions([]);
      } else {
        setDestinationSuggestions([]);
      }
    } finally {
      if (activeRequestRef.current === controller) {
        activeRequestRef.current = null;
      }
      setIsSuggestionsLoading(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  const normalizeFareAddress = (address) => {
    return String(address || "")
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)
      .slice(0, 6)
      .join(", ");
  };

  // Get fare
  const findTrip = async () => {
    if (!pickup || !destination) {
      setError("Please enter both pickup and destination");
      return;
    }

    setError("");
    setIsLoadingFare(true);

    const pickupQuery = normalizeFareAddress(pickup);
    const destinationQuery = normalizeFareAddress(destination);

    try {
      const res = await axios.get(`${API_BASE_URL}/rides/get-fare`, {
        params: { pickup: pickupQuery, destination: destinationQuery },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setFare(res.data);
      setVehiclePanel(true);
      // we can close suggestions once we move to vehicle selection
      setPanelOpen(false);
    } catch (err) {
      console.error("Fare calculation error:", err);
      const statusCode = err.response?.status;
      if (statusCode === 502) {
        setError(
          err.response?.data?.message ||
            "Location services are temporarily busy. Please select locations from suggestions and retry.",
        );
      } else {
        setError(err.response?.data?.message || "Failed to calculate fare");
      }
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
        `${API_BASE_URL}/rides/create`,
        { pickup, destination, vehicleType },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      console.log("✅ Ride created:", res.data);
      setRide(res.data);
      setActiveRideRequestId(res.data?._id || null);
      setWaitingForDriver(false);
      setRideStatusMessage("");
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
      transform: showWaitingPanel ? "translateY(0)" : "translateY(100%)",
      duration: 0.3,
      ease: "power2.inOut",
    });
  }, [showWaitingPanel]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (sheetRef.current && !sheetRef.current.contains(event.target)) {
        closeSuggestions();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

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
        <div
          ref={sheetRef}
          className="pointer-events-auto flex h-[72%] flex-col rounded-t-3xl bg-white px-6 pt-6 pb-4 shadow-2xl"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-purple-600 uppercase">
                Trip Planner
              </p>
              <h4 className="mt-1 text-2xl font-bold text-gray-900">
                Find a trip
              </h4>
            </div>
            <button
              type="button"
              onClick={closeSuggestions}
              className="rounded-full border border-gray-200 bg-white p-2 text-gray-500 transition-all hover:bg-gray-50 hover:text-gray-900"
              aria-label="Close suggestions"
            >
              <i className="ri-close-line text-lg"></i>
            </button>
          </div>

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
              onFocus={() => {
                setPanelOpen(true);
                setActiveField("pickup");
              }}
              value={pickup}
              onChange={(e) => handleLocationChange("pickup", e.target.value)}
              className="w-full px-12 py-3 text-base transition-all bg-gray-100 border-2 border-transparent rounded-xl focus:border-purple-500 focus:outline-none"
              type="text"
              placeholder="Add a pick-up location"
              autoComplete="off"
            />

            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField("destination");
              }}
              onFocus={() => {
                setPanelOpen(true);
                setActiveField("destination");
              }}
              value={destination}
              onChange={(e) =>
                handleLocationChange("destination", e.target.value)
              }
              className="w-full px-12 py-3 mt-3 text-base transition-all bg-gray-100 border-2 border-transparent rounded-xl focus:border-purple-500 focus:outline-none"
              type="text"
              placeholder="Enter your destination"
              autoComplete="off"
            />
          </form>

          <div className="flex-1 min-h-0 overflow-hidden">
            {/* Suggestions live here, above the button */}
            {panelOpen && (
              <div className="h-full overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
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
                  isLoading={isSuggestionsLoading}
                  error={suggestionsError}
                  onClose={closeSuggestions}
                />
              </div>
            )}
          </div>

          <div className="sticky bottom-0 mt-4 bg-gradient-to-t from-white via-white to-white/80 pt-3 pb-1 backdrop-blur-sm">
            <button
              onClick={findTrip}
              disabled={isLoadingFare || !pickup || !destination}
              className="flex items-center justify-center w-full px-4 py-3 font-semibold text-white transition-all bg-black rounded-2xl shadow-lg hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
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
      </div>

      {/* Vehicle selection panel */}
      {vehiclePanel && (
        <div
          ref={vehiclePanelRef}
          className="fixed bottom-0 z-30 w-full px-3 py-10 pt-12 translate-y-full bg-white shadow-2xl rounded-t-3xl"
        >
          <VehiclePanel
            selectVehicle={setVehicleType}
            fare={fare}
            setConfirmRidePanel={setConfirmRidePanel}
            setVehiclePanel={setVehiclePanel}
          />
        </div>
      )}

      {/* Confirm ride panel */}
      {confirmRidePanel && (
        <div
          ref={confirmRidePanelRef}
          className="fixed bottom-0 z-30 w-full px-3 py-6 pt-12 translate-y-full bg-white shadow-2xl rounded-t-3xl"
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
      )}

      {/* Looking for driver panel */}
      {vehicleFound && (
        <div
          ref={vehicleFoundRef}
          className="fixed bottom-0 z-30 w-full px-3 py-6 pt-12 translate-y-full bg-white shadow-2xl rounded-t-3xl"
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
      )}

      {/* Waiting for driver panel */}
      <div
        ref={waitingForDriverRef}
        className="fixed bottom-0 z-40 w-full px-3 py-6 pt-12 translate-y-full bg-white shadow-2xl rounded-t-3xl"
      >
        {showWaitingPanel && (
          <WaitingForDriver
            ride={ride}
            rideStatusMessage={rideStatusMessage}
            setVehicleFound={setVehicleFound}
            setWaitingForDriver={setWaitingForDriver}
            waitingForDriver={waitingForDriver}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
