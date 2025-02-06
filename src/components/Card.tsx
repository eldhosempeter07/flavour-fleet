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
    <div className="w-64 mb-4 mx-4 max-w-xs bg-white rounded  dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
      <div className="relative h-52 w-52 bg-gray-200 dark:bg-gray-700 flex justify-center items-center">
        {loading ? (
          <span className="text-gray-500">Loading...</span>
        ) : imageUrl ? (
          <img
            className="w-full h-full object-cover pointer-events-none"
            src={imageUrl}
            alt={foodItem.name}
          />
        ) : null}
        <div>
          <button
            className="absolute cursor-pointer bottom-[0.7rem] right-[0.3rem] text-white bg-white rounded-[50%] text-xl p-[0.1rem]"
            onClick={() => addToCart(foodItem.id)}
          >
            ➕
          </button>
          <button className="absolute bottom-[0.7rem] right-[2.6rem] text-white bg-white rounded-[50%] text-xl p-[0.1rem]">
            💚
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="px-1 py-4">
        <h5 className="text-[1rem] font-semibold text-gray-900 dark:text-white truncate">
          {foodItem.name}
        </h5>
        {/* <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
          {foodItem.description}
        </p> */}

        {/* Price and Add to Cart Button */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-[0.9rem]">
            ${foodItem.price}
          </span>
          {/* <button
            className="bg-black text-white font-medium rounded px-5 py-2  "
            
          >
            Add to cart
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Card;
