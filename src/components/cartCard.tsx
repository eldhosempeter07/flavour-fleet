import React, { useEffect, useState } from "react";
import { FoodItem } from "../util/types";
import { getImage } from "../util/functions";

type CartCardProps = {
  foodItem: FoodItem;
  addItemToCart?: (itemid: string, count: number) => void;
  type?: string;
};

const CartCard: React.FC<CartCardProps> = ({
  foodItem,
  addItemToCart,
  type,
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getImage({ imageUrl: foodItem.imageURL, setImageUrl, setLoading });
  }, [foodItem.imageURL]);

  if (loading) {
    return <div>Loading..</div>;
  }

  return (
    <div className="flex bg-white rounded items-center justify-center ">
      <div className="relative w-52 h-36 flex justify-center items-center">
        {loading ? (
          <span className="text-gray-500">Loading...</span>
        ) : imageUrl ? (
          <img
            className="w-full h-full object-cover  rounded-lg pointer-events-none"
            src={imageUrl}
            alt={foodItem.name}
          />
        ) : null}
      </div>

      <div className="ml-20 mb-3 flex-auto">
        <h5 className="text-xl font-bold  text-gray-900 truncate">
          {foodItem.name}
        </h5>
        <p className="text-sm mt-[8px]  text-gray-600 truncate">
          {foodItem.category.toUpperCase()}
        </p>
        <p className="text-sm mt-[2px]  text-gray-600 truncate">
          {foodItem.ingredients}
        </p>
        <div className="flex justify-between">
          <h4 className="text-lg mt-10 font-bold  text-gray-900 truncate">
            ${foodItem.price}
          </h4>
          {type === "checkout" ? (
            <h4 className="text-lg  font-bold mt-[5px]  text-gray-900 truncate">
              {foodItem.count}
            </h4>
          ) : (
            <div className="flex mt-9">
              <h4
                className="text-2xl  mr-2 font-bold cursor-pointer"
                onClick={() => {
                  foodItem?.count &&
                    foodItem?.count !== 1 &&
                    addItemToCart &&
                    addItemToCart(foodItem.id, -1);
                }}
              >
                -
              </h4>
              <h4 className="text-lg  font-bold mt-[5px]  text-gray-900 truncate">
                {foodItem.count}
              </h4>
              <h4
                className="text-2xl font-bold ml-2 cursor-pointer"
                onClick={() => addItemToCart && addItemToCart(foodItem.id, 1)}
              >
                +
              </h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartCard;
