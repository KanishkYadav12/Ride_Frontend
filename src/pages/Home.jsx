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
  const activeRideRequestIdRef = useRef(null);

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

  const normalizeRideId = (id) => {
    if (!id) return "";
    if (typeof id === "string") return id;
    if (typeof id === "object" && id.$oid) return String(id.$oid);
    return String(id);
  };

  useEffect(() => {
    activeRideRequestIdRef.current = normalizeRideId(activeRideRequestId);
  }, [activeRideRequestId]);

  // Socket: join room and listen for ride events
  useEffect(() => {
    if (!socket || !user?._id) return;

    const joinSocketRoom = () => {
      if (!socket.connected) return;
      socket.emit("join", { userType: "user", userId: user._id });
      console.log("✅ User joined socket room:", user._id, socket.id);
    };

    const handleRideConfirmed = (confirmedRide) => {
      console.log("🚗 Ride confirmed:", confirmedRide);

      if (!confirmedRide?._id) {
        return;
      }

      const confirmedRideId = normalizeRideId(confirmedRide._id);
      const pendingRideRequestId = activeRideRequestIdRef.current;

      if (pendingRideRequestId && confirmedRideId !== pendingRideRequestId) {
        console.log(
          "ℹ️ Ignoring ride-confirmed for unrelated ride:",
          confirmedRideId,
        );
        return;
      }

      setRide(confirmedRide);
      setActiveRideRequestId(confirmedRideId);
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
      activeRideRequestIdRef.current = "";
      navigate("/riding", { state: { ride: startedRide } });
    };

    const handleError = (err) => {
      console.error("❌ Socket error:", err);
      setError(err.message || "Something went wrong");
    };

    if (socket.connected) {
      joinSocketRoom();
    }

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
  }, [socket, user, navigate]);

  useEffect(() => {
    if (!activeRideRequestId || waitingForDriver) return;

    let isMounted = true;

    const checkRideStatus = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/rides/${activeRideRequestId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (!isMounted) return;

        const latestRide = res.data;
        const latestStatus = String(latestRide?.status || "").toLowerCase();

        if (latestStatus === "accepted") {
          setRide(latestRide);
          setVehicleFound(false);
          setWaitingForDriver(true);
          setRideStatusMessage(
            `${latestRide?.captain?.fullname?.firstname || "Your captain"} accepted your ride and is coming to your location. Please wait a few minutes and share the OTP on arrival.`,
          );
        }

        if (latestStatus === "ongoing") {
          setWaitingForDriver(false);
          setRideStatusMessage("");
          setActiveRideRequestId(null);
          activeRideRequestIdRef.current = "";
          navigate("/riding", { state: { ride: latestRide } });
        }
      } catch (err) {
        // Keep silent to avoid noisy UX while polling.
      }
    };

    checkRideStatus();
    const intervalId = setInterval(checkRideStatus, 2500);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [activeRideRequestId, waitingForDriver, navigate]);

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
      const createdRideId = normalizeRideId(res.data?._id);
      setActiveRideRequestId(createdRideId || null);
      activeRideRequestIdRef.current = createdRideId;
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
    <div className="screen-base screen-user">
      <div className="aurora-backdrop" />

      <div className="top-nav absolute inset-x-0 top-0">
        <img
          className="w-16 drop-shadow-sm"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt="Uber"
        />
        <button
          onClick={() => navigate("/user/logout")}
          className="icon-btn border-red-100 bg-red-500 text-white hover:bg-red-600"
        >
          <i className="text-xl ri-logout-box-r-line"></i>
        </button>
      </div>

      <div className="relative h-screen w-screen overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-sky-600">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.24),transparent_34%),radial-gradient(circle_at_85%_10%,rgba(255,255,255,0.16),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.08),rgba(15,23,42,0.24))]" />
        <div className="absolute inset-x-0 bottom-28 h-40 bg-[linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.14)_1px,transparent_1px)] bg-[length:28px_28px] opacity-35" />

        <div className="relative z-10 px-5 pt-20 sm:px-6">
          <div className="w-full rounded-3xl border border-white/30 bg-white/20 p-4 text-white shadow-xl backdrop-blur-md sm:p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/85">
              Ready to ride
            </p>
            <h2 className="mt-1 text-2xl font-bold">Where to today?</h2>
            <p className="mt-2 text-sm text-white/90">
              Book fast, track live, and share your trip safely.
            </p>

            <div className="mt-4 flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                <i className="ri-shield-check-line mr-1"></i>
                Verified captains
              </span>
              <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                <i className="ri-timer-line mr-1"></i>
                Quick pickup
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute top-0 flex h-screen w-full flex-col justify-end">
        <div
          ref={sheetRef}
          className="sheet-panel pointer-events-auto flex h-[66%] flex-col px-5 pb-4 pt-5 sm:px-6"
        >
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <p className="title-kicker">Trip Planner</p>
              <h4 className="mt-1 text-2xl font-bold text-slate-900">
                Find a trip
              </h4>
              <p className="mt-1 text-xs text-slate-500">
                Set pickup and destination to unlock fares.
              </p>
            </div>
            <button
              type="button"
              onClick={closeSuggestions}
              className="icon-btn h-9 w-9"
              aria-label="Close suggestions"
            >
              <i className="ri-close-line text-lg"></i>
            </button>
          </div>

          {error && (
            <div className="alert-error mt-3">
              <i className="ri-error-warning-line"></i>
              <span>{error}</span>
            </div>
          )}

          <form className="relative py-3" onSubmit={submitHandler}>
            <div className="pointer-events-none absolute left-5 top-1/2 h-16 w-[2px] -translate-y-1/2 rounded-full bg-slate-400" />

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
              className="input-main border-transparent bg-slate-100 px-12"
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
              className="input-main mt-3 border-transparent bg-slate-100 px-12"
              type="text"
              placeholder="Enter your destination"
              autoComplete="off"
            />
          </form>

          <div className="flex-1 min-h-0 overflow-hidden pt-1">
            {panelOpen ? (
              <div className="h-full overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
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
            ) : (
              <div className="h-full space-y-3 overflow-y-auto pr-1">
                <div className="surface-block">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-600">
                      Quick picks
                    </p>
                    <span className="text-xs text-slate-500">Tap to fill</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPickup("Indore Junction Railway Station");
                        setPanelOpen(false);
                      }}
                      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:border-violet-300 hover:bg-violet-50"
                    >
                      <i className="ri-train-line text-violet-600"></i>
                      Station
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDestination("Devi Ahilya Bai Holkar Airport");
                        setPanelOpen(false);
                      }}
                      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:border-violet-300 hover:bg-violet-50"
                    >
                      <i className="ri-flight-takeoff-line text-violet-600"></i>
                      Airport
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDestination("Treasure Island Mall");
                        setPanelOpen(false);
                      }}
                      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:border-violet-300 hover:bg-violet-50"
                    >
                      <i className="ri-store-2-line text-violet-600"></i>
                      City Mall
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDestination("Sarwate Bus Stand");
                        setPanelOpen(false);
                      }}
                      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:border-violet-300 hover:bg-violet-50"
                    >
                      <i className="ri-bus-2-line text-violet-600"></i>
                      Bus Stand
                    </button>
                  </div>
                </div>

                <div className="surface-block bg-gradient-to-br from-violet-50 to-indigo-50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-white">
                      <i className="ri-route-line text-lg"></i>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Trip planning made easy
                      </p>
                      <p className="text-xs text-slate-600">
                        Add pickup and destination, then we will show the best
                        fare options instantly.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="surface-block">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                      Recent places
                    </p>
                    <span className="text-xs text-slate-400">Suggested</span>
                  </div>

                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPickup("Vijay Nagar, Indore");
                        setDestination("Bhawarkua Square, Indore");
                        setPanelOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-left transition hover:border-violet-300 hover:bg-violet-50"
                    >
                      <span className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          Vijay Nagar to Bhawarkua
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          Fast route · Usual commute
                        </p>
                      </span>
                      <i className="ri-arrow-right-up-line text-slate-400"></i>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPickup("Geeta Bhawan Square, Indore");
                        setDestination("Rajwada, Indore");
                        setPanelOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-left transition hover:border-violet-300 hover:bg-violet-50"
                    >
                      <span className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          Geeta Bhawan to Rajwada
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          Popular in evening hours
                        </p>
                      </span>
                      <i className="ri-arrow-right-up-line text-slate-400"></i>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center shadow-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Eta
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-900">
                      8-15 min
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center shadow-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Safety
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-900">
                      Protected
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center shadow-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Support
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-900">
                      24/7
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 mt-4 bg-gradient-to-t from-white via-white to-white/80 pb-1 pt-3 backdrop-blur-sm">
            <button
              onClick={findTrip}
              disabled={isLoadingFare || !pickup || !destination}
              className="btn-user"
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
          className="sheet-panel fixed bottom-0 z-30 w-full translate-y-full px-3 py-8 pt-11"
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
          className="sheet-panel fixed bottom-0 z-30 w-full translate-y-full px-3 py-6 pt-11"
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
          className="sheet-panel fixed bottom-0 z-30 w-full translate-y-full px-3 py-6 pt-11"
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
        className="sheet-panel fixed bottom-0 z-40 w-full translate-y-full px-3 py-6 pt-11"
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
