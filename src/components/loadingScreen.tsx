import React from "react";

const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* Food Truck Emoji with Bounce Animation */}
      <div className="text-5xl animate-bounce"> 🧑‍🍳🧑‍🍳</div>

      {/* Loading Text */}
      <p className="mt-4 text-sm font-semibold text-gray-700">Loading ...</p>
    </div>
  );
};

export default LoadingScreen;
