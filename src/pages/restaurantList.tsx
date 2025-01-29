import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../util/firebase";
import { Restaurant } from "../util/types";

const RestaurantList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    const fetchResturants = async () => {
      const querysnapshot = await getDocs(collection(db, "restaurants"));
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
        <div>
          <a href={`restaurant/${restaurant.id}`}>
            {restaurant.name} - {restaurant.location}
          </a>
        </div>
      ))}
    </div>
  );
};
export default RestaurantList;
