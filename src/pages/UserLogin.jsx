import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

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
      const response = await axios.post(`${API_BASE_URL}/users/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        const { user, token } = response.data;
        setUser(user);
        localStorage.setItem("token", token);
        navigate("/home");
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
    <div className="screen-base screen-user">
      <div className="aurora-backdrop" />
      <div className="relative z-10 flex min-h-screen flex-col justify-between px-5 pb-6 pt-8 sm:px-8">
        <div>
          <div className="mb-10 flex justify-center">
            <img
              className="w-20 drop-shadow-sm"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s"
              alt="Uber"
            />
          </div>

          <div className="panel-card p-6 sm:p-7">
            <p className="title-kicker">Passenger Access</p>
            <h2 className="mt-1 text-3xl font-bold text-slate-900">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Sign in to book your next ride in seconds.
            </p>

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
                  className="input-main"
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
                  className="input-main"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
              </div>

              <button type="submit" disabled={isLoading} className="btn-user">
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

            <p className="mt-5 text-center text-sm text-slate-600">
              New here?{" "}
              <Link
                to="/signup"
                className="font-semibold text-violet-700 hover:text-violet-800"
              >
                Create new Account
              </Link>
            </p>
          </div>
        </div>

        <div>
          <Link to="/captain-login" className="btn-captain">
            <i className="mr-2 ri-steering-2-line"></i>
            Sign in as Captain
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
