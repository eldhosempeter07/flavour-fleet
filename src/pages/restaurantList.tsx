import React from "react";
import { Restaurant } from "../util/types";
import RestaurantCard from "../components/resCard";

type RestaurantListProps = {
  restaurants: Restaurant[] | null;
  category: string | null;
};

const RestaurantList: React.FC<RestaurantListProps> = ({
  restaurants,
  category,
}) => {
  return (
    <div className="md:mx-10 mx-2">
      {category !== null ? (
        <h3 className=" text-orange-600">
          <span className="font-bold text-xl uppercase">
            {category} Restaurants{" "}
          </span>
          <span className="font-semibold text-gray-700">
            {" "}
            ({restaurants?.length} Results)
          </span>
        </h3>
      ) : null}
      <div className="flex  flex-wrap ">
        {restaurants &&
          restaurants.map((restaurant) => (
            <a href={`restaurant/${restaurant.id}`}>
              <RestaurantCard restaurant={restaurant} />
            </a>
          ))}
      </div>
    </div>
  );
};
export default RestaurantList;
