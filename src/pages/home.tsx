import React, { useEffect, useState } from "react";
import RestaurantList from "./restaurantList";
import HomeHero from "../components/homeHero";
import { Categories, Restaurant } from "../util/types";
import {
  getRestaurants,
  getRestaurantsByCategory,
} from "../util/userRestaurant";

const Home = () => {
  const [categories, setCategories] = useState<Categories[] | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[] | null>(null);

  useEffect(() => {
    const fetchRestaurantsByCategory = async () => {
      if (category !== null) {
        const restaurants = await getRestaurantsByCategory(category);
        console.log(restaurants);
        setRestaurants(restaurants);
      }
    };
    fetchRestaurantsByCategory();
  }, [category]);

  const fetchResturants = async () => {
    const restaurantItems = await getRestaurants();
    setRestaurants(restaurantItems);
  };

  useEffect(() => {
    fetchResturants();
  }, []);

  const handleReset = () => {
    setCategory(null);
    fetchResturants();
  };

  return (
    <div className="mt-10 ">
      <HomeHero
        categories={categories}
        setCategories={setCategories}
        setCategory={setCategory}
      />
      <div className=" text-right mr-5 mt-10">
        <button
          onClick={handleReset}
          className=" rounded-full text-sm font-semibold py-[0.3rem] px-3 bg-slate-200"
        >
          Reset
        </button>
      </div>
      <RestaurantList category={category} restaurants={restaurants} />
    </div>
  );
};

export default Home;
