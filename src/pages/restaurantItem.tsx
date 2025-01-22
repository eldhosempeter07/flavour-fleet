import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Restaurant } from "../util/interface";
import { getRestaurantById } from "../util/userRestaurant";

const RestaurantItem = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  useEffect(() => {
    const fetchResturantById = async () => {
      if (!id) return;

      try {
        const data = await getRestaurantById(id);
        if (data) setRestaurant(data);
      } catch (error) {}
    };
    fetchResturantById();
  }, [id]);

  return <div>{restaurant?.name}</div>;
};

export default RestaurantItem;
