import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Start = () => {
  useEffect(() => {
    document.querySelector(".hero-content")?.classList.add("animate-in");
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-black via-gray-900 to-purple-900">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1619059558110-c45be64b73ae?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3')] bg-cover bg-center opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full px-6 pt-8 pb-6">
        <div className="flex justify-center">
          <img
            className="w-20 drop-shadow-2xl"
            src="https://cdn-assets-eu.frontify.com/s3/frontify-enterprise-files-eu/eyJwYXRoIjoid2VhcmVcL2ZpbGVcLzhGbTh4cU5SZGZUVjUxYVh3bnEyLnN2ZyJ9:weare:F1cOF9Bps96cMy7r9Y2d7affBYsDeiDoIHfqZrbcxAw?width=1200&height=417"
            alt="Uber"
          />
        </div>

        <div className="transition-all duration-700 ease-out translate-y-8 opacity-0 hero-content">
          <div className="p-8 bg-white shadow-2xl rounded-3xl bg-opacity-95">
            <div className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
              Welcome to the future of rides
            </div>

            <h1 className="mb-3 text-4xl font-bold text-gray-900">
              Get Started with Uber
            </h1>

            <p className="mb-6 text-gray-600">
              Your ride is just a tap away. Safe, reliable transportation.
            </p>

            <Link
              to="/login"
              className="flex items-center justify-center w-full py-4 font-semibold text-white bg-black shadow-lg rounded-xl"
            >
              <span>Continue</span>
              <i className="ml-2 ri-arrow-right-line"></i>
            </Link>

            <div className="grid grid-cols-3 gap-3 mt-6 text-center">
              <div className="p-3 rounded-lg bg-gray-50">
                <i className="text-2xl text-purple-600 ri-time-line"></i>
                <p className="mt-1 text-xs font-medium text-gray-700">
                  Fast Pickup
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50">
                <i className="text-2xl text-blue-600 ri-shield-check-line"></i>
                <p className="mt-1 text-xs font-medium text-gray-700">
                  Safe Rides
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50">
                <i className="text-2xl text-green-600 ri-price-tag-3-line"></i>
                <p className="mt-1 text-xs font-medium text-gray-700">
                  Best Prices
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-content.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default Start;
