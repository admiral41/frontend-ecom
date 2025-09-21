"use client"
import React, { useState, useEffect } from "react";

const NavTop = () => {

  const messages = [
    "💻 Best deals on laptops and accessories!",
    "⚡ Get 20% off on your first purchase.",
    "🛠️ Free repair checkup every Friday.",
    "🚚 Free delivery on orders above Rs. 5000."
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Rotate messages every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="w-full sticky top-0 z-50 bg-gray-100 text-gray-700 px-4 sm:px-6 lg:px-8 py-2 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
        
        <h1 className="text-sm sm:text-base md:text-lg font-semibold tracking-wide cursor-pointer hover:text-gray-900 transition text-center sm:text-left">
          The Computer Club
        </h1>

        <div className="text-red-600 font-medium text-xs sm:text-sm md:text-base min-h-[20px] transition-opacity duration-500 ease-in-out text-center sm:text-left">
          {messages[currentIndex]}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-xs sm:text-sm font-medium">
          <p className="flex items-center gap-1 hover:text-red-600 cursor-pointer">
            📞 1234567
          </p>
          <p className="flex items-center gap-1 hover:text-red-600 cursor-pointer">
            📍 Store Location
          </p>
        </div>
      </div>
    </div>
  );
};

export default NavTop;
