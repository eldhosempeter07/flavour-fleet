import React, { useEffect, useState } from "react";
import { Restaurant } from "../util/types";
import { storage1 } from "../util/firebase";
import { getDownloadURL, ref } from "firebase/storage";
import { getImage } from "../util/functions";

interface RestaurantProps {
  restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantProps> = ({ restaurant }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getImage({ imageUrl: restaurant.image, setImageUrl, setLoading });
  }, [restaurant.image]);
  return (
    <div className="w-full mb-4 mx-4 max-w-xs bg-white rounded  dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
      <div className="relative h-56 w-full bg-gray-200 dark:bg-gray-700 flex justify-center items-center">
        {loading ? (
          <span className="text-gray-500">Loading...</span>
        ) : imageUrl ? (
          <img
            className="w-fit h-fit object-fill pointer-events-none"
            src={imageUrl}
            alt={restaurant.name}
          />
        ) : null}
      </div>

      {/* RestaurantCard Content */}
      <div className="px-5 py-4">
        <h5 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
          {restaurant.name}
        </h5>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
          {restaurant.location}
        </p>
      </div>
    </div>
  );
};

export default RestaurantCard;
