import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/CaptainContext";
import { API_BASE_URL } from "../config/api";

const Captainlogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { setCaptain } = useContext(CaptainDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/captains/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        const { captain, token } = response.data;
        setCaptain(captain);
        localStorage.setItem("token", token);
        navigate("/captain-home");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-between h-screen p-7 bg-gradient-to-br from-white to-green-50">
      <div>
        <div className="flex justify-center mb-8">
          <img
            className="w-24"
            src="https://www.svgrepo.com/show/505031/uber-driver.svg"
            alt="Captain"
          />
        </div>

        <div className="p-6 bg-white shadow-lg rounded-2xl">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Captain Login
          </h2>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-lg">
              <i className="ri-error-warning-line"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={submitHandler}>
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

            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-gray-900 transition-all border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-green-500 focus:bg-white focus:outline-none"
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 font-semibold text-white transition-all bg-black rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="ri-loader-4-line animate-spin"></i>
                  Signing in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-600">
            Join a fleet?{" "}
            <Link
              to="/captain-signup"
              className="font-semibold text-green-600 hover:text-green-700"
            >
              Register as a Captain
            </Link>
          </p>
        </div>
      </div>

      <div>
        <Link
          to="/login"
          className="flex items-center justify-center w-full py-3 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
        >
          <i className="mr-2 ri-user-line"></i>
          Sign in as User
        </Link>
      </div>
    </div>
  );
};

export default Captainlogin;
