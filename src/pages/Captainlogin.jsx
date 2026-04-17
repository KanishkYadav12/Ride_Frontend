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
    <div className="screen-base screen-captain">
      <div className="aurora-backdrop" />
      <div className="relative z-10 flex min-h-screen flex-col justify-between px-5 pb-6 pt-8 sm:px-8">
        <div>
          <div className="mb-8 flex justify-center">
            <img
              className="w-24 drop-shadow-sm"
              src="https://www.svgrepo.com/show/505031/uber-driver.svg"
              alt="Captain"
            />
          </div>

          <div className="panel-card p-6 sm:p-7">
            <p className="title-kicker text-emerald-700">Captain Access</p>
            <h2 className="mt-1 text-3xl font-bold text-slate-900">
              Captain Login
            </h2>

            {error && (
              <div className="alert-error mb-4 mt-4">
                <i className="ri-error-warning-line"></i>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={submitHandler} className="mt-5">
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

              <div className="mb-6">
                <label className="field-label">Password</label>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-main focus:border-emerald-500 focus:ring-emerald-100"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-captain"
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

            <p className="mt-5 text-center text-sm text-slate-600">
              Join a fleet?{" "}
              <Link
                to="/captain-signup"
                className="font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Register as a Captain
              </Link>
            </p>
          </div>
        </div>

        <div>
          <Link
            to="/login"
            className="btn-soft border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100"
          >
            <i className="mr-2 ri-user-line"></i>
            Sign in as User
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Captainlogin;
