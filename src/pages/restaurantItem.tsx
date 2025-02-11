import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Restaurant } from "../util/types";
import { getRestaurantById } from "../util/userRestaurant";
import { addToCart, getCartItems } from "../util/user";
import { AuthContext } from "../util/context/authContext";
import Card from "../components/Card";
import { getImage } from "../util/functions";
import addToCartSound from "../assets/add_to_cart.mp3";
import { useCart } from "../util/context/cartContext";

const RestaurantItem = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const navigate = useNavigate();
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

  const { setCart } = useCart();
  const fetchCartItems = async () => {
    if (user?.uid) {
      const items = await getCartItems(user?.uid);
      if (items === undefined) {
        return setCart(null);
      }
      setCart(items);
    }
  };

  const { user } = useContext(AuthContext) ?? {
    user: null,
  };

  const playSound = () => {
    const audio = new Audio(addToCartSound);
    audio.play();
  };

  const addItemToCart = async (itemid: string) => {
    if (id && user) {
      setAddItemLoading(true);
      await addToCart(itemid, 1, id, user.uid);

      await fetchCartItems();
      playSound();
      return setAddItemLoading(false);
    }

    navigate("/login");
  };

  const [imageLoading, setImageLoading] = useState(true);
  const [addItemLoading, setAddItemLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    getImage({
      imageUrl: `restaurants/${restaurant?.image}`,
      setImageUrl,
      setLoading: setImageLoading,
    });
  }, [restaurant?.image]);

  return (
    <div className="px-5 pt-5">
      <img
        src={imageUrl}
        alt={restaurant?.image}
        className="max-h-64 w-full object-cover pointer-events-none"
      />
      <div className="flex justify-between md:flex-row flex-col  my-10">
        <h3 className="md:text-3xl text-lg font-bold uppercase text-gray-800">
          {restaurant?.name}
        </h3>
        <h3 className="text-lg font-semibold  text-gray-700">
          {restaurant?.location}
        </h3>
      </div>
      <div className="flex flex-wrap">
        {restaurant?.menuItems?.map((item) => (
          <Card
            foodItem={item}
            addToCart={addItemToCart}
            addItemLoading={addItemLoading}
          />
        ))}
      </div>
    </div>
  );
};

export default RestaurantItem;
