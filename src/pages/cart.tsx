import React, { useContext, useEffect, useState } from "react";
import { getCartItems } from "../util/user";
import { AuthContext } from "../util/authContext";
import { Cart } from "../util/types";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext) ?? {
    user: null,
    loading: true,
  };
  const [cartItems, setCartItems] = useState<Cart | undefined>(undefined);
  useEffect(() => {
    const fetchCartItems = async () => {
      if (user?.uid) {
        const items = await getCartItems(user?.uid);
        setCartItems(items);
      }
    };

    fetchCartItems();
  });

  console.log(loading);

  return (
    <div className="mx-5">
      <h3>Cart</h3>
      <h4>{cartItems?.resturant.name}</h4>
      <h4>{cartItems?.items.name}</h4>
      <h4>{cartItems?.items.price}</h4>

      <button
        className="rounded bg-blue-500 text-white font-bold py-2 px-3 mt-4 hover:bg-blue-700"
        onClick={() => navigate(`/checkout/${user?.uid}`)}
      >
        Checkout
      </button>
    </div>
  );
};

export default CartPage;
