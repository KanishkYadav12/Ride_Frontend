import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/CaptainContext";

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
        `${import.meta.env.VITE_BASE_URL}/captains/register`,
        captainData
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
    <div className="flex flex-col justify-between h-screen px-5 py-5 overflow-y-auto bg-gradient-to-br from-white to-green-50">
      <div>
        <div className="flex justify-center mb-6">
          <img
            className="w-24"
            src="https://www.svgrepo.com/show/505031/uber-driver.svg"
            alt="Captain"
          />
        </div>

        <div className="p-6 bg-white shadow-lg rounded-2xl">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Become a Captain
          </h2>

          {error && (
            <div className="flex items-start gap-2 p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-lg">
              <i className="mt-0.5 ri-error-warning-line"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={submitHandler}>
            {/* Name Fields */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="flex gap-3">
                <input
                  required
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-1/2 px-4 py-3 text-gray-900 transition-all border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-green-500 focus:bg-white focus:outline-none"
                  placeholder="First name"
                  disabled={isLoading}
                  minLength={3}
                />
                <input
                  required
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-1/2 px-4 py-3 text-gray-900 transition-all border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-green-500 focus:bg-white focus:outline-none"
                  placeholder="Last name"
                  disabled={isLoading}
                  minLength={3}
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-gray-900 transition-all border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-green-500 focus:bg-white focus:outline-none"
                placeholder="email@example.com"
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-gray-900 transition-all border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-green-500 focus:bg-white focus:outline-none"
                placeholder="Create a password (min 6 characters)"
                disabled={isLoading}
                minLength={6}
              />
            </div>

            {/* Vehicle Information Header */}
            <div className="flex items-center gap-2 pt-4 mb-4 border-t border-gray-200">
              <i className="text-xl text-green-600 ri-car-line"></i>
              <h3 className="text-lg font-semibold text-gray-900">
                Vehicle Information
              </h3>
            </div>

            {/* Vehicle Color & Plate */}
            <div className="flex gap-3 mb-4">
              <div className="w-1/2">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Vehicle Color
                </label>
                <input
                  required
                  type="text"
                  value={vehicleColor}
                  onChange={(e) => setVehicleColor(e.target.value)}
                  className="w-full px-4 py-3 text-gray-900 transition-all border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-green-500 focus:bg-white focus:outline-none"
                  placeholder="e.g., Black"
                  disabled={isLoading}
                  minLength={3}
                />
              </div>
              <div className="w-1/2">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  License Plate
                </label>
                <input
                  required
                  type="text"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                  className="w-full px-4 py-3 text-gray-900 transition-all border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-green-500 focus:bg-white focus:outline-none"
                  placeholder="e.g., ABC1234"
                  disabled={isLoading}
                  minLength={3}
                />
              </div>
            </div>

            {/* Vehicle Capacity & Type */}
            <div className="flex gap-3 mb-6">
              <div className="w-1/2">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Capacity
                </label>
                <input
                  required
                  type="number"
                  value={vehicleCapacity}
                  onChange={(e) => setVehicleCapacity(e.target.value)}
                  className="w-full px-4 py-3 text-gray-900 transition-all border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-green-500 focus:bg-white focus:outline-none"
                  placeholder="Seats"
                  disabled={isLoading}
                  min={1}
                  max={10}
                />
              </div>
              <div className="w-1/2">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Vehicle Type
                </label>
                <select
                  required
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full px-4 py-3 text-gray-900 transition-all border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-green-500 focus:bg-white focus:outline-none"
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
              className="w-full py-3 font-semibold text-white transition-all bg-black rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
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

          <p className="mt-4 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link
              to="/captain-login"
              className="font-semibold text-green-600 hover:text-green-700"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-xs leading-tight text-center text-gray-500">
          This site is protected by reCAPTCHA and the{" "}
          <span className="underline">Google Privacy Policy</span> and{" "}
          <span className="underline">Terms of Service</span> apply.
        </p>
      </div>
    </div>
  );
};

export default CaptainSignup;
