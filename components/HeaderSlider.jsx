import React, { useState, useEffect } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";

const HeaderSlider = () => {
  const [sliderData, setSliderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await fetch("http://localhost:5070/api/sliders");
        if (!response.ok) {
          throw new Error("Failed to fetch slider data");
        }
        const data = await response.json();
        setSliderData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSliders();
  }, []);

  useEffect(() => {
    if (sliderData.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliderData.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [sliderData.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-600">
        Error: {error}
      </div>
    );
  }

  if (sliderData.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        No sliders available
      </div>
    );
  }

  return (
    <div className="overflow-hidden relative w-full">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {sliderData.map((slide, index) => (
          <div
            key={slide._id}
            className="flex flex-col-reverse md:flex-row items-center justify-between bg-[#E6E9F2] py-8 md:px-14 px-5 mt-6 rounded-xl min-w-full"
          >
            <div className="md:pl-8 mt-10 md:mt-0 md:w-1/2">
              {slide.offerText && (
                <p className="md:text-base text-orange-600 pb-1">
                  {slide.offerText}
                </p>
              )}
              <h1 className="max-w-lg md:text-[40px] md:leading-[48px] text-2xl font-semibold">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="text-gray-600 mt-2">{slide.subtitle}</p>
              )}
              <div className="flex items-center mt-4 md:mt-6">
                {slide.buttons?.map((button, btnIndex) => (
                  <a
                    key={btnIndex}
                    href={button.link}
                    className={`${
                      button.variant === "primary"
                        ? "md:px-10 px-7 md:py-2.5 py-2 bg-orange-600 rounded-full text-white font-medium"
                        : "group flex items-center gap-2 px-6 py-2.5 font-medium"
                    } mr-4`}
                  >
                    {button.text}
                    {button.variant !== "primary" && (
                      <Image
                        className="group-hover:translate-x-1 transition"
                        src={assets.arrow_icon}
                        alt="arrow_icon"
                        width={16}
                        height={16}
                      />
                    )}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-end md:justify-end flex-1 md:pr-8">
              {slide.imageUrl && (
                <img
                  className="md:w-72 w-48 object-contain"
                  src={slide.imageUrl}
                  alt={slide.title}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-8">
        {sliderData.map((_, index) => (
          <div
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-2 w-2 rounded-full cursor-pointer ${
              currentSlide === index ? "bg-orange-600" : "bg-gray-500/30"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;