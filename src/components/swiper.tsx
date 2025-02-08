import React, { useState, useEffect } from "react";
import { Categories } from "../util/types";
import CategoryImage from "./categoryImage";
import Back from "../assets/back.png";
import Next from "../assets/next.png";
interface SwiperProps {
  categories: Categories[];
}

const getImagesPerView = () => {
  if (window.innerWidth >= 1280) return 9; // Large screens
  if (window.innerWidth >= 1024) return 7; // Medium screens
  if (window.innerWidth >= 768) return 5; // Tablets
  return 3; // Mobile
};

const Swiper = ({ categories }: SwiperProps) => {
  const [scrollIndex, setScrollIndex] = useState(0);
  const [imagesPerView, setImagesPerView] = useState(getImagesPerView());

  useEffect(() => {
    const handleResize = () => {
      setImagesPerView(getImagesPerView());
      setScrollIndex(0);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxScrollIndex = Math.max(categories.length - imagesPerView, 0);

  const scrollLeft = () => {
    setScrollIndex((prev) => Math.max(prev - 3, 0));
  };

  const scrollRight = () => {
    setScrollIndex((prev) => Math.min(prev + 3, maxScrollIndex));
  };

  return (
    <div className="relative w-full p-4">
      {/* Left Scroll Button */}
      {scrollIndex > 0 && (
        <button
          onClick={scrollLeft}
          className="disabled:bg-gray-500 absolute  left-3 top-1/2 transform -translate-y-1/2 bg-gray-100 p-[0.4rem] rounded-full shadow-lg z-10"
        >
          <img src={Back} className="w-5" alt="back" />
        </button>
      )}

      {/* Swiper Container */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300"
          style={{
            transform: `translateX(-${scrollIndex * (100 / imagesPerView)}%)`,
          }}
        >
          {categories.map((category) => (
            <div
              key={category.id}
              className="w-1/8 flex-shrink-0 p-2"
              style={{ width: `${100 / imagesPerView}%` }}
            >
              <div className=" rounded-lg overflow-hidden flex items-center justify-center">
                <CategoryImage category={category} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Scroll Button */}
      {scrollIndex < maxScrollIndex && (
        <button
          onClick={scrollRight}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-100 text-white p-[0.4rem] rounded-full shadow-lg z-10"
        >
          <img src={Next} className="w-5" alt="next" />
        </button>
      )}
    </div>
  );
};

export default Swiper;
