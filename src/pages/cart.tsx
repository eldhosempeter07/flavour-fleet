import React, { useContext, useEffect, useState } from "react";
import {
  addToCart,
  deleteFromCart,
  emptyCart,
  getCartItems,
} from "../util/user";
import { AuthContext } from "../util/context/authContext";
import { useNavigate } from "react-router-dom";
import CartCard from "../components/cartCard";
import { useCart } from "../util/context/cartContext";

const CartPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext) ?? {
    user: null,
    loading: true,
  };
  const [cartLoading, setCartLoading] = useState(false);
  const { cart, setCart } = useCart();
  const [addItemLoading, setAddItemLoading] = useState(false);

  const fetchCartItems = async () => {
    if (user?.uid) {
      const items = await getCartItems(user?.uid);
      if (items === undefined) {
        return setCart(null);
      }
      setCart(items);
      setCartLoading(false);
    }
  };

  useEffect(() => {
    setCartLoading(true);
    fetchCartItems();
  }, []);

  const addItemToCart = async (itemid: string, count: number) => {
    if (cart?.cartinfo?.restarantId && user) {
      setAddItemLoading(true);
      await addToCart(itemid, count, cart?.cartinfo?.restarantId, user.uid);
      await fetchCartItems();
      return setAddItemLoading(false);
    }
    navigate("/login");
  };

  const handleDeleteCartItem = async (id: string) => {
    if (user?.uid) {
      setAddItemLoading(true);
      await deleteFromCart(id, user.uid);
      await fetchCartItems();
      return setAddItemLoading(false);
    }
  };

  const handleEmptyCart = async () => {
    if (user?.uid) {
      setAddItemLoading(true);
      await emptyCart(user.uid);
      await fetchCartItems();
      return setAddItemLoading(false);
    }
  };

  return (
    <div className="flex justify-center ">
      {cart === undefined || cart === null ? (
        <div className="flex flex-col justify-center items-center h-screen">
          <h3 className="font-bold">Cart Is Empty</h3>
          <button
            onClick={() => navigate("/")}
            className="bg-gray-800 py-1 px-2 rounded text-white mt-3"
          >
            Go back to home
          </button>
        </div>
      ) : (
        <>
          {cartLoading ? null : (
            <div className="w-full max-w-6xl">
              <h3 className="text-center font-bold text-lg uppercase ">Cart</h3>
              <div className="border-2 border-gray-200 rounded px-3 py-4 mt-10 ">
                <a
                  href={`/restaurant/${cart?.cartinfo?.restarantId}`}
                  className="ml-5 font-bold text-gray-800 underline uppercase text-lg"
                >
                  {cart?.resturant?.name}
                </a>
                {cart?.items.map((item) => (
                  <div key={item.id} className="m-7">
                    <CartCard
                      foodItem={item}
                      addItemToCart={addItemToCart}
                      handleDeleteCartItem={handleDeleteCartItem}
                      addItemLoading={addItemLoading}
                    />
                  </div>
                ))}
              </div>
              <div className=" text-center sm:mb-4 mb-10 ">
                <button
                  className="bg-black uppercase rounded px-3 text-sm font-semibold py-3 mt-10 text-white"
                  onClick={() => navigate(`/checkout/${user?.uid}`)}
                >
                  Checkout
                </button>

                <button
                  className="bg-black ml-4 uppercase rounded px-3 text-sm font-semibold py-3 mt-10 text-white"
                  onClick={handleEmptyCart}
                >
                  Empty Cart
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CartPage;
