import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db1 } from "../util/firebase";
import { Restaurant } from "../util/types";
import RestaurantCard from "../components/resCard";

const RestaurantList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    const fetchResturants = async () => {
      const querysnapshot = await getDocs(collection(db1, "restaurants"));
      const restaurantItems: Restaurant[] = [];

      querysnapshot.forEach((doc) => {
        const data = doc.data();
        restaurantItems.push({
          id: doc.id,
          email: data.email || "",
          image: data.image || "",
          location: data.location || "",
          name: data.name || "",
          phone: data.phone || "",
          type: data.type || "",
        });
      });

      setRestaurants(restaurantItems);
    };

    fetchResturants();
  });

  return (
    <div>
      {restaurants.map((restaurant) => (
        <a href={`restaurant/${restaurant.id}`}>
          <RestaurantCard restaurant={restaurant} />
        </a>
      ))}
    </div>
  );
};
export default RestaurantList;
