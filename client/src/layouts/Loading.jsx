/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { FaMusic } from "react-icons/fa";

export default function Loading({ theme = "green" }) {
  const colors = {
    green: {
      pulse: "bg-green-500 opacity-50",
      border: "border-green-600",
      inner: "bg-green-700",
      text: "text-green-600",
    },
    pink: {
      pulse: "bg-pink-500 opacity-50",
      border: "border-pink-600",
      inner: "bg-pink-700",
      text: "text-pink-600",
    },
  };

  const colorClasses = colors[theme] || colors.green;

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center h-40"
    >
      <div className="relative w-20 h-20">
        <span
          className={`absolute inset-0 rounded-full animate-ping ${colorClasses.pulse}`}
        ></span>

        <span
          className={`absolute inset-2 rounded-full border-4 animate-spin border-t-transparent ${colorClasses.border}`}
        ></span>

        <span className={`absolute inset-5 rounded-full ${colorClasses.inner}`}></span>

        <FaMusic
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-4xl animate-bounce"
          aria-hidden="true"
        />
      </div>
      <span
        className={`mt-4 font-semibold tracking-wide select-none ${colorClasses.text}`}
      >
        Loading your tunes...
      </span>
    </div>
  );
}
