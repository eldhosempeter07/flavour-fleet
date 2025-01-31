import React, { useContext, useEffect, useState } from "react";
import { addToCart, getCartItems } from "../util/user";
import { AuthContext } from "../util/authContext";
import { Cart } from "../util/types";
import { useNavigate } from "react-router-dom";
import { getImage } from "../util/functions";
import CartCard from "../components/cartCard";

const CartPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext) ?? {
    user: null,
    loading: true,
  };
  const [cartItems, setCartItems] = useState<Cart | undefined>(undefined);

  const addItemToCart = (itemid: string, count: number) => {
    if (cartItems?.cartinfo?.restarantId && user) {
      addToCart(itemid, count, cartItems?.cartinfo?.restarantId, user.uid);
      return fetchCartItems();
    }
    navigate("/login");
  };

  const fetchCartItems = async () => {
    if (user?.uid) {
      const items = await getCartItems(user?.uid);
      setCartItems(items);
    }
  };

  console.log(cartItems);

  useEffect(() => {
    fetchCartItems();
  }, []);

  if (loading) {
    return <div>Loading..</div>;
  }

  return (
    <div className="flex justify-center ">
      {cartItems === undefined ? (
        <div className="flex justify-center items-center h-screen">
          <h3>Cart Is Empty</h3>
        </div>
      ) : (
        <>
          <div className="w-full max-w-6xl">
            <h3 className="text-center font-bold text-xl uppercase ">Cart</h3>
            <div className="border-2 border-gray-200 rounded px-3 py-4 mt-10 ">
              <a
                href={`/restaurant/${cartItems?.cartinfo?.restarantId}`}
                className="ml-5 font-bold text-gray-800 underline uppercase text-xl"
              >
                {cartItems?.resturant?.name}
              </a>
              {cartItems?.items.map((item) => (
                <div key={item.id} className="m-7">
                  <CartCard foodItem={item} addItemToCart={addItemToCart} />
                </div>
              ))}
            </div>
            <div className="text-right mb-4">
              <button
                className="bg-black uppercase rounded px-3  py-3 mt-10 text-white"
                onClick={() => navigate(`/checkout/${user?.uid}`)}
              >
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
