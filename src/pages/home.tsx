import React, { useEffect, useState } from "react";
import RestaurantList from "./restaurantList";
import HomeHero from "../components/homeHero";
import { Categories } from "../util/types";
import {
  getRestaurants,
  getRestaurantsByCategory,
} from "../util/userRestaurant";
import { useCategory } from "../util/categoryContext";
import { useRestaurant } from "../util/restaurantContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [categories, setCategories] = useState<Categories[] | null>(null);
  const { setSelectedCategory, selectedCategory } = useCategory();
  // const [restaurants, setRestaurants] = useState<Restaurant[] | null>(null);
  const { restaurants, setRestaurants } = useRestaurant();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchRestaurantsByCategory = async () => {
      if (selectedCategory !== null) {
        const restaurants = await getRestaurantsByCategory(selectedCategory);
        setRestaurants(restaurants);
        navigate(`/`);
      }
    };
    fetchRestaurantsByCategory();

    if (selectedCategory === null) {
      fetchResturants();
    }
  }, [selectedCategory]);

  const fetchResturants = async () => {
    const restaurantItems = await getRestaurants();

    setRestaurants(restaurantItems);
  };

  useEffect(() => {
    fetchResturants();
  }, []);

  const handleReset = () => {
    navigate(`/`);
    setSelectedCategory(null);
    fetchResturants();
  };

  return (
    <div className="mt-5 ">
      <HomeHero categories={categories} setCategories={setCategories} />
      <div className=" text-right mr-5 mt-4">
        <button
          onClick={handleReset}
          className=" rounded-full text-sm font-semibold py-[0.3rem] px-3 bg-slate-200"
        >
          Reset
        </button>
      </div>
      <RestaurantList category={selectedCategory} restaurants={restaurants} />
    </div>
  );
};

export default Home;
