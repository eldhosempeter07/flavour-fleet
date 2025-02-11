import React, { useEffect, useState } from "react";
import { FoodItem } from "../util/types";
import { getImage } from "../util/functions";
import { Trash2 } from "lucide-react";
import { LoaderCircle } from "lucide-react";
type CartCardProps = {
  foodItem: FoodItem;
  addItemToCart?: (itemid: string, count: number) => void;
  type?: string;
  handleDeleteCartItem?: (id: string) => void;
  addItemLoading?: boolean;
};

const CartCard: React.FC<CartCardProps> = ({
  foodItem,
  addItemToCart,
  type,
  handleDeleteCartItem,
  addItemLoading,
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string | null>(null);
  useEffect(() => {
    getImage({
      imageUrl: `foods/${foodItem.name}.jpg`,
      setImageUrl,
      setLoading,
    });
  }, [foodItem.name]);

  useEffect(() => {
    if (addItemLoading === false) setId(null);
  }, [addItemLoading]);

  return (
    <div className="flex flex-wrap bg-white rounded items-center justify-center mb-10 ">
      <div className="relative w-52 h-36 flex justify-center items-center">
        {loading ? (
          <div className="text-gray-500 w-52 h-36"></div>
        ) : imageUrl ? (
          <img
            className="w-full h-full object-contain rounded pointer-events-none"
            src={imageUrl}
            alt={foodItem.name}
          />
        ) : null}
      </div>

      <div className="md:ml-20 ml-0 mb-3 flex-auto">
        <div className="flex justify-between">
          <div>
            <h5 className="text-lg font-bold  text-gray-900 truncate">
              {foodItem.name}
            </h5>
            <p className="text-sm mt-[8px]  text-gray-600 truncate">
              {foodItem.category.toUpperCase()}
            </p>
            <p className="text-sm mt-[2px]  text-gray-600 truncate">
              {foodItem.ingredients}
            </p>
          </div>
          {type === "checkout" ? null : (
            <Trash2
              className="text-red-600 cursor-pointer text-sm mt-3 "
              onClick={() =>
                handleDeleteCartItem && handleDeleteCartItem(foodItem.id)
              }
            />
          )}
        </div>
        <div className="flex flex-wrap justify-between">
          <h4 className="text-lg mt-10 font-bold  text-gray-900 truncate">
            ${foodItem.price}
          </h4>
          {type === "checkout" ? (
            <h4 className="text-lg  font-bold mt-[5px]  text-gray-900 truncate">
              {foodItem.count}
            </h4>
          ) : (
            <div
              className={`${
                addItemLoading ? "cursor-not-allowed" : null
              } flex flex-wrap mt-9`}
            >
              <h4
                className={`${
                  foodItem.count === 1 ? "cursor-not-allowed" : null
                } text-2xl  mr-2 font-bold cursor-pointer `}
                onClick={() => {
                  !addItemLoading &&
                    foodItem?.count &&
                    foodItem?.count !== 1 &&
                    addItemToCart &&
                    addItemToCart(foodItem.id, -1);
                  setId(foodItem.id);
                }}
              >
                -
              </h4>
              {addItemLoading && id === foodItem.id ? (
                <LoaderCircle className="animate-spin mt-[10px]" size={15} />
              ) : (
                <h4 className="text-lg  font-bold mt-[5px]  text-gray-900 truncate">
                  {foodItem.count}
                </h4>
              )}
              <h4
                className={`${
                  addItemLoading ? "cursor-not-allowed" : null
                } text-2xl font-bold ml-2 cursor-pointer`}
                onClick={() => {
                  !addItemLoading &&
                    addItemToCart &&
                    addItemToCart(foodItem.id, 1);
                  setId(foodItem.id);
                }}
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
