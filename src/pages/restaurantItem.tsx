import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Restaurant } from "../util/types";
import { getRestaurantById } from "../util/userRestaurant";
import { addToCart } from "../util/user";
import { AuthContext } from "../util/authContext";
import Card from "../components/Card";
import { getImage } from "../util/functions";

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

  const { user, loading } = useContext(AuthContext) ?? {
    user: null,
    loading: true,
  };

  const addItemToCart = (itemid: string) => {
    console.log(itemid);
    if (id && user) return addToCart(itemid, 1, id, user.uid);
    navigate("/login");
  };

  const [imageLoading, setImageLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    getImage({
      imageUrl: `restaurants/${restaurant?.image}`,
      setImageUrl,
      setLoading: setImageLoading,
    });
  }, [restaurant?.image]);

  console.log(restaurant);

  console.log(imageUrl);

  return (
    <div className="px-5 pt-5">
      <img
        src={imageUrl}
        alt={restaurant?.image}
        className="max-h-64 w-full object-cover pointer-events-none"
      />
      <div className="flex justify-between  my-10">
        <h3 className="text-3xl font-bold uppercase text-gray-800">
          {restaurant?.name}
        </h3>
        <h3 className="text-lg font-semibold  text-gray-700">
          {restaurant?.location}
        </h3>
      </div>
      <div className="flex flex-wrap">
        {restaurant?.menuItems?.map((item) => (
          <Card foodItem={item} addToCart={addItemToCart} />
        ))}
      </div>
    </div>
  );
};

export default RestaurantItem;
