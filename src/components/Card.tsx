import React, { useEffect, useState } from "react";
import { FoodItem } from "../util/types";
import { getImage } from "../util/functions";
interface FoodItemProps {
  foodItem: FoodItem;
  addToCart: (id: string) => void;
  addItemLoading: boolean;
}

const Card: React.FC<FoodItemProps> = ({
  foodItem,
  addToCart,
  addItemLoading,
}) => {
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    getImage({
      imageUrl: `foods/${foodItem.name}.jpg`,
      setImageUrl,
      setLoading,
    });
  }, [foodItem.name, imageUrl]);

  return (
    <div className="md:w-64 w-44 mb-4 mx-4 max-w-xs  rounded   dark:border-gray-700 overflow-hidden">
      <div className="relative md:h-52 h-44 w-44  md:w-52 flex justify-center items-center">
        {loading ? (
          <div className="h-52 w-52 text-gray-500"></div>
        ) : imageUrl ? (
          <img
            className="md:w-full w-44 md:h-full h-44 object-cover pointer-events-none"
            src={imageUrl}
            alt={foodItem.name}
          />
        ) : null}
        <div>
          <button
            className="disabled:cursor-not-allowed absolute cursor-pointer bottom-[0.7rem] right-[0.3rem] text-white bg-white rounded-[50%] text-xl p-[0.1rem]"
            disabled={addItemLoading}
            onClick={() => {
              setId(foodItem.id);
              addToCart(foodItem.id);
            }}
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
        </div>
      </div>
    </div>
  );
};

export default Card;
