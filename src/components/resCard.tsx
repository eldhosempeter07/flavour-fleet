import React, { useEffect, useState } from "react";
import { Restaurant } from "../util/types";
import { storage1 } from "../util/firebase";
import { getDownloadURL, ref } from "firebase/storage";
import { getImage } from "../util/functions";
import Star from "../assets/star.svg";
interface RestaurantProps {
  restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantProps> = ({ restaurant }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getImage({
      imageUrl: `restaurants/${restaurant.image}`,
      setImageUrl,
      setLoading,
    });
  }, [restaurant.image]);
  return (
    <div className="mt-10 w-full mb-4 mx-4 max-w-xs bg-white rounded overflow-hidden">
      <div className="relative md:h-32 h-28 object-cover w-44 md:w-64 overflow-hidden flex justify-center items-center">
        {loading ? (
          <span className="text-gray-500"></span>
        ) : imageUrl ? (
          <img
            className="w-fit h-fit object-fill rounded-lg md:rounded-none pointer-events-none"
            src={imageUrl}
            alt={restaurant.name}
          />
        ) : null}
      </div>

      {/* RestaurantCard Content */}
      <div className="mt-2">
        <h5 className="text-xl leading-tight tracking-tight font-semibold text-gray-900  truncate">
          {restaurant.name}
        </h5>
        {/* <p className="text-sm  font-medium text-gray-700 dark:text-gray-300 mt-1">
          {restaurant.location}
        </p> */}
        <p className="text-sm  font-medium tracking-tight text-gray-600  mt-1">
          $4.99 Delivery Fee
        </p>
        <p className="text-sm  font-medium tracking-tight text-gray-600  mt-[0.2rem]">
          {restaurant.rating}{" "}
          <img src={Star} className="w-4 mb-1 inline" alt="star" /> (
          {Math.floor(Math.random() * (200 - 100 + 1)) + 100}+)
        </p>
      </div>
    </div>
  );
};

export default RestaurantCard;
