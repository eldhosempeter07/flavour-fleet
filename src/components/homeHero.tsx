import React, { useEffect, useState } from "react";
import { Categories } from "../util/types";
import { getCategories } from "../util/user";
import CategoryImage from "./categoryImage";
import Swiper from "./swiper";

type HomeHeroProps = {
  categories: Categories[] | null;
  setCategories: (cat: Categories[]) => void;
};

const HomeHero: React.FC<HomeHeroProps> = ({ categories, setCategories }) => {
  useEffect(() => {
    const fetchCategories = async () => {
      const cat = await getCategories();
      setCategories(cat);
    };
    fetchCategories();
  }, []);

  return (
    <div>
      <div className="flex justify-center flex-wrap mb-2">
        {categories != null && <Swiper categories={categories} />}
      </div>
    </div>
  );
};

export default HomeHero;
