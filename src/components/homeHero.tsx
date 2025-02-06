import React, { useEffect, useRef } from "react";
import { Categories } from "../util/types";
import { getCategories } from "../util/user";
import CategoryImage from "./categoryImage";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import leftArrow from "../assets/back.png";
import rightArrow from "../assets/next.png";

type HomeHeroProps = {
  categories: Categories[] | null;
  setCategories: (cat: Categories[]) => void;
  setCategory: (category: string) => void;
};

const HomeHero: React.FC<HomeHeroProps> = ({
  categories,
  setCategories,
  setCategory,
}) => {
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const cat = await getCategories();
      setCategories(cat);
    };
    fetchCategories();
  }, [setCategories]);

  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    if (swiperRef.current) {
      setTimeout(() => {
        if (swiperRef.current?.swiper) {
          swiperRef.current.swiper.params.navigation.prevEl = prevRef.current;
          swiperRef.current.swiper.params.navigation.nextEl = nextRef.current;
          swiperRef.current.swiper.navigation.init();
          swiperRef.current.swiper.navigation.update();
        }
      });
    }
  }, [prevRef.current, nextRef.current]);

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Left Arrow Button */}
      <button
        ref={prevRef}
        className="absolute top-1/2 left-[-2rem] sm:left-[-1rem] md:left-[-3rem] z-20 transform -translate-y-1/2 bg-white p-2 shadow-md rounded-full"
      >
        <img src={leftArrow} alt="Previous" className="w-6 h-6" />
      </button>

      {/* Swiper Component */}
      <Swiper
        ref={swiperRef}
        modules={[Navigation, Pagination]}
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        pagination={false}
        loop={false}
        autoplay={false}
        slidesPerView={8}
        spaceBetween={5}
        breakpoints={{
          320: {
            slidesPerView: 2, // For small screens (e.g., mobile)
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 3, // For medium screens
            spaceBetween: 15,
          },
          768: {
            slidesPerView: 4, // For tablets
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 6, // For larger screens
            spaceBetween: 25,
          },
          1280: {
            slidesPerView: 9, // For very large screens
            spaceBetween: 30,
          },
        }}
      >
        {categories?.map((category) => (
          <SwiperSlide key={category.id}>
            <CategoryImage category={category} setCategory={setCategory} />
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        ref={nextRef}
        className="absolute top-1/2 right-[-2rem] sm:right-[-1rem] md:right-[-3rem] z-20 transform -translate-y-1/2 bg-white p-2 shadow-md rounded-full"
      >
        <img src={rightArrow} alt="Next" className="w-6 h-6" />
      </button>
    </div>
  );
};

export default HomeHero;
