import React, { useContext, useEffect, useState } from "react";
import { Cart, Order } from "../util/types";
import { createOrder, getCartItems } from "../util/user";
import { AuthContext } from "../util/authContext";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
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

  const handlePlaceOrder = async () => {
    const orderInfo = {
      addressId: "MA12423EWR",
      fees: {
        deliveryFee: "3.99",
        subTotal: cartItems?.items.price.toString(),
        tax: "2.99",
      },
      instruction: "",
      payId: "PTR12RFJ32",
      userId: user?.uid,
      orderItems: [cartItems?.cartinfo.itemId],
    } as Order;
    const id = await createOrder(orderInfo);
    console.log(id);

    navigate(`/success/${id}`);
  };

  return (
    <div className="mx-5 mt-5">
      <h3>Checkout</h3>
      <h4>{cartItems?.resturant.name}</h4>
      <h4>{cartItems?.items.name}</h4>
      <h4>{cartItems?.items.price}</h4>

      <button
        className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-white mt-4"
        onClick={handlePlaceOrder}
      >
        Place Order
      </button>
    </div>
  );
};

export default Checkout;
