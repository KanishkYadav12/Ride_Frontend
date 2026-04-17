import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/CaptainContext";
import { API_BASE_URL } from "../config/api";

const CaptainSignup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { setCaptain } = useContext(CaptainDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const captainData = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email,
      password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: Number(vehicleCapacity),
        vehicleType,
      },
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/captains/register`,
        captainData,
      );

      if (response.status === 201) {
        const { captain, token } = response.data;
        setCaptain(captain);
        localStorage.setItem("token", token);
        navigate("/captain-home");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        "Registration failed. Please try again.";
      setError(errorMessage);
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="screen-base screen-captain overflow-y-auto">
      <div className="aurora-backdrop" />
      <div className="relative z-10 flex min-h-screen flex-col justify-between px-5 py-6 sm:px-8">
        <div>
          <div className="mb-6 flex justify-center">
            <img
              className="w-24 drop-shadow-sm"
              src="https://www.svgrepo.com/show/505031/uber-driver.svg"
              alt="Captain"
            />
          </div>

          <div className="panel-card p-6 sm:p-7">
            <p className="title-kicker text-emerald-700">Captain Onboarding</p>
            <h2 className="mt-1 text-3xl font-bold text-slate-900">
              Become a Captain
            </h2>

            {error && (
              <div className="alert-error mb-4 mt-4 items-start">
                <i className="ri-error-warning-line mt-0.5"></i>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={submitHandler} className="mt-5">
              {/* Name Fields */}
              <div className="mb-4">
                <label className="field-label">Full Name</label>
                <div className="flex gap-3">
                  <input
                    required
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="input-main w-1/2 focus:border-emerald-500 focus:ring-emerald-100"
                    placeholder="First name"
                    disabled={isLoading}
                    minLength={3}
                  />
                  <input
                    required
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="input-main w-1/2 focus:border-emerald-500 focus:ring-emerald-100"
                    placeholder="Last name"
                    disabled={isLoading}
                    minLength={3}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="field-label">Email Address</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-main focus:border-emerald-500 focus:ring-emerald-100"
                  placeholder="email@example.com"
                  disabled={isLoading}
                />
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="field-label">Password</label>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-main focus:border-emerald-500 focus:ring-emerald-100"
                  placeholder="Create a password (min 6 characters)"
                  disabled={isLoading}
                  minLength={6}
                />
              </div>

              {/* Vehicle Information Header */}
              <div className="mb-4 flex items-center gap-2 border-t border-slate-200 pt-4">
                <i className="ri-car-line text-xl text-emerald-600"></i>
                <h3 className="text-lg font-semibold text-slate-900">
                  Vehicle Information
                </h3>
              </div>

              {/* Vehicle Color & Plate */}
              <div className="flex gap-3 mb-4">
                <div className="w-1/2">
                  <label className="field-label">Vehicle Color</label>
                  <input
                    required
                    type="text"
                    value={vehicleColor}
                    onChange={(e) => setVehicleColor(e.target.value)}
                    className="input-main focus:border-emerald-500 focus:ring-emerald-100"
                    placeholder="e.g., Black"
                    disabled={isLoading}
                    minLength={3}
                  />
                </div>
                <div className="w-1/2">
                  <label className="field-label">License Plate</label>
                  <input
                    required
                    type="text"
                    value={vehiclePlate}
                    onChange={(e) => setVehiclePlate(e.target.value)}
                    className="input-main focus:border-emerald-500 focus:ring-emerald-100"
                    placeholder="e.g., ABC1234"
                    disabled={isLoading}
                    minLength={3}
                  />
                </div>
              </div>

              {/* Vehicle Capacity & Type */}
              <div className="flex gap-3 mb-6">
                <div className="w-1/2">
                  <label className="field-label">Capacity</label>
                  <input
                    required
                    type="number"
                    value={vehicleCapacity}
                    onChange={(e) => setVehicleCapacity(e.target.value)}
                    className="input-main focus:border-emerald-500 focus:ring-emerald-100"
                    placeholder="Seats"
                    disabled={isLoading}
                    min={1}
                    max={10}
                  />
                </div>
                <div className="w-1/2">
                  <label className="field-label">Vehicle Type</label>
                  <select
                    required
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="input-main focus:border-emerald-500 focus:ring-emerald-100"
                    disabled={isLoading}
                  >
                    <option value="" disabled>
                      Select Type
                    </option>
                    <option value="car">🚗 Car</option>
                    <option value="auto">🛺 Auto</option>
                    <option value="motorcycle">🏍️ Motorcycle</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-captain"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="ri-loader-4-line animate-spin"></i>
                    Creating account...
                  </span>
                ) : (
                  "Create Captain Account"
                )}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                to="/captain-login"
                className="font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-center text-xs leading-tight text-slate-500">
            This site is protected by reCAPTCHA and the{" "}
            <span className="underline">Google Privacy Policy</span> and{" "}
            <span className="underline">Terms of Service</span> apply.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CaptainSignup;
