import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        { email, password }
      );

      if (response.status === 200) {
        const { user, token } = response.data;
        setUser(user);
        localStorage.setItem("token", token);
        navigate("/home");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-between h-screen p-7 bg-gradient-to-br from-white to-gray-50">
      <div>
        <div className="flex justify-center mb-10">
          <img
            className="w-20"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s"
            alt="Uber"
          />
        </div>

        <div className="p-6 bg-white shadow-lg rounded-2xl">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Welcome Back
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
                className="w-full px-4 py-3 text-gray-900 transition-all border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-purple-500 focus:bg-white focus:outline-none"
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
                className="w-full px-4 py-3 text-gray-900 transition-all border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-purple-500 focus:bg-white focus:outline-none"
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
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-600">
            New here?{" "}
            <Link
              to="/signup"
              className="font-semibold text-purple-600 hover:text-purple-700"
            >
              Create new Account
            </Link>
          </p>
        </div>
      </div>

      <div>
        <Link
          to="/captain-login"
          className="flex items-center justify-center w-full py-3 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
        >
          <i className="mr-2 ri-steering-2-line"></i>
          Sign in as Captain
        </Link>
      </div>
    </div>
  );
};

export default UserLogin;
