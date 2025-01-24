import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Restaurant } from "../util/interface";
import { getRestaurantById } from "../util/userRestaurant";
import { addToCart } from "../util/user";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../util/firebase";
import { AuthContext } from "../util/authContext";

const RestaurantItem = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [count, setCount] = useState<number>(1);

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

  const { user, loading } = useContext(AuthContext) ?? {
    user: null,
    loading: true,
  };

  const addItemToCart = (itemid: string) => {
    if (id && user) addToCart(itemid, count, id, user.uid);
  };

  return (
    <div className="px-5 pt-5">
      <div className="text-right">
        <a
          href={`/cart/${user?.uid}`}
          className=" font-bold text-blue-700 cursor-pointer"
        >
          Cart
        </a>
      </div>
      <h3>{restaurant?.name}</h3>
      {restaurant?.menuItems?.map((item) => (
        <>
          <h4>{item.name}</h4>
          <h4>{item.price}</h4>
          <span
            onClick={() => {
              count > 1 && setCount((prev) => prev - 1);
            }}
          >
            -
          </span>
          <span>{count}</span>
          <span onClick={() => setCount((prev) => prev + 1)}>+</span>
          <button
            className="block mt-3 bg-blue-600 border-none p-2 font-bold text-white"
            onClick={() => addItemToCart(item.id)}
          >
            Add To Cart
          </button>
        </>
      ))}
    </div>
  );
};

export default RestaurantItem;
