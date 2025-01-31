import React, { useEffect, useState } from "react";
import { FoodItem } from "../util/types";
import { getImage } from "../util/functions";

interface FoodItemProps {
  foodItem: FoodItem;
  addToCart: (id: string) => void;
}

const Card: React.FC<FoodItemProps> = ({ foodItem, addToCart }) => {
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    getImage({ imageUrl: foodItem.imageURL, setImageUrl, setLoading });
  }, [foodItem.imageURL, imageUrl]);

  return (
    <div className="w-full mb-4 mx-4 max-w-xs bg-white rounded  dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
      <div className="relative h-56 w-full bg-gray-200 dark:bg-gray-700 flex justify-center items-center">
        {loading ? (
          <span className="text-gray-500">Loading...</span>
        ) : imageUrl ? (
          <img
            className="w-full h-full object-cover pointer-events-none"
            src={imageUrl}
            alt={foodItem.name}
          />
        ) : null}
      </div>

      {/* Card Content */}
      <div className="px-1 py-4">
        <h5 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
          {foodItem.name}
        </h5>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
          {foodItem.description}
        </p>

        {/* Price and Add to Cart Button */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-2xl font-bold text-gray-800 dark:text-white">
            ${foodItem.price}
          </span>
          <button
            className="bg-black text-white font-medium rounded px-5 py-2  "
            onClick={() => addToCart(foodItem.id)}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
