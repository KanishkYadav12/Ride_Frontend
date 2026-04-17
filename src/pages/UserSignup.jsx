import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";
import { API_BASE_URL } from "../config/api";

const UserSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const newUser = {
        fullname: {
          firstname: firstName,
          lastname: lastName,
        },
        email,
        password,
      };

      const response = await axios.post(
        `${API_BASE_URL}/users/register`,
        newUser,
      );

      if (response.status === 201) {
        const { user, token } = response.data;
        setUser(user);
        localStorage.setItem("token", token);
        navigate("/home");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
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
          <div className="mb-8 flex justify-center">
            <img
              className="w-20 drop-shadow-sm"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s"
              alt="Uber"
            />
          </div>

          <div className="panel-card p-6 sm:p-7">
            <p className="title-kicker">Passenger Onboarding</p>
            <h2 className="mt-1 text-3xl font-bold text-slate-900">
              Create Account
            </h2>

            {error && (
              <div className="alert-error mb-4 mt-4">
                <i className="ri-error-warning-line"></i>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={submitHandler} className="mt-5">
              <div className="mb-4">
                <label className="field-label">Full Name</label>
                <div className="flex gap-3">
                  <input
                    required
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="input-main w-1/2"
                    placeholder="First name"
                    disabled={isLoading}
                  />
                  <input
                    required
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="input-main w-1/2"
                    placeholder="Last name"
                    disabled={isLoading}
                  />
                </div>
              </div>

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
                  placeholder="Create a password (min 6 characters)"
                  minLength={6}
                  disabled={isLoading}
                />
              </div>

              <button type="submit" disabled={isLoading} className="btn-user">
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="ri-loader-4-line animate-spin"></i>
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-violet-700 hover:text-violet-800"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>

        <div>
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

export default UserSignup;
