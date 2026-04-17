import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Start = () => {
  useEffect(() => {
    document.querySelector(".hero-content")?.classList.add("animate-in");
  }, []);

  return (
    <div className="screen-base screen-user">
      <div className="aurora-backdrop" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1619059558110-c45be64b73ae?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3')] bg-cover bg-center opacity-10" />

      <div className="relative z-10 flex h-screen flex-col justify-between px-5 pb-6 pt-8 sm:px-8">
        <div className="flex justify-center">
          <img
            className="w-20 drop-shadow-lg"
            src="https://cdn-assets-eu.frontify.com/s3/frontify-enterprise-files-eu/eyJwYXRoIjoid2VhcmVcL2ZpbGVcLzhGbTh4cU5SZGZUVjUxYVh3bnEyLnN2ZyJ9:weare:F1cOF9Bps96cMy7r9Y2d7affBYsDeiDoIHfqZrbcxAw?width=1200&height=417"
            alt="Uber"
          />
        </div>

        <div className="hero-content translate-y-8 opacity-0 transition-all duration-700 ease-out">
          <div className="panel-card overflow-hidden p-6 sm:p-8">
            <div className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-xs font-semibold text-violet-700">
              Your city, your ride, your time
            </div>

            <h1 className="mt-5 text-4xl font-bold text-slate-900">
              Move smarter with Uber
            </h1>

            <p className="mb-7 mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              Book in seconds, match with trusted captains, and track your
              journey live with a cleaner experience.
            </p>

            <Link to="/login" className="btn-user py-3.5">
              <span>Continue as Passenger</span>
              <i className="ml-2 ri-arrow-right-line"></i>
            </Link>

            <div className="mt-4">
              <Link
                to="/captain-login"
                className="btn-soft border-emerald-200 bg-emerald-50 py-3 text-emerald-700 hover:bg-emerald-100"
              >
                <i className="mr-2 ri-steering-2-line"></i>
                Continue as Captain
              </Link>
            </div>

            <div className="mt-7 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                <i className="ri-time-line text-2xl text-violet-600"></i>
                <p className="mt-1 text-xs font-medium text-slate-700">
                  Fast Pickup
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                <i className="ri-shield-check-line text-2xl text-sky-600"></i>
                <p className="mt-1 text-xs font-medium text-slate-700">
                  Safe Rides
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                <i className="ri-price-tag-3-line text-2xl text-emerald-600"></i>
                <p className="mt-1 text-xs font-medium text-slate-700">
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
