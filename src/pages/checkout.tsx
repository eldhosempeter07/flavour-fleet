import React, { useContext, useEffect, useState } from "react";
import { AddressType, CardType, Cart, Order } from "../util/types";
import {
  createOrder,
  getAddresses,
  getCards,
  getCartItems,
} from "../util/user";
import { AuthContext } from "../util/context/authContext";
import { useNavigate } from "react-router-dom";
import CartCard from "../components/cartCard";
import { maskCardNumber } from "../util/functions";

const Checkout = () => {
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext) ?? {
    user: null,
    loading: true,
  };
  const [addresses, setAddresses] = useState<AddressType[] | undefined>(
    undefined
  );
  const [cartItems, setCartItems] = useState<Cart | undefined>(undefined);
  const [cards, setCards] = useState<CardType[] | undefined>(undefined);

  const fetchCards = async () => {
    if (user) {
      const cards = await getCards(user.uid);
      if (cards) {
        setCards(cards);
      }
    }
  };

  useEffect(() => {
    fetchCards();
  }, [user]);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (user?.uid) {
        const items = await getCartItems(user?.uid);
        setCartItems(items);
      }
    };

    fetchCartItems();
  }, []);

  const fetchAddresses = async () => {
    if (user) {
      const addresses = await getAddresses(user.uid);
      if (addresses) {
        setAddresses(addresses);
      }
    }
  };
  useEffect(() => {
    fetchAddresses();
  }, [user]);

  const handlePlaceOrder = async () => {
    const orderInfo = {
      addressId: addresses !== undefined && addresses[0].id,
      restaurantId: cartItems?.cartinfo.restarantId,
      createdAt: new Date(),
      fees: {
        deliveryFee: "3.99",
        subTotal: cartItems?.totalAmount.toString(),
        tax: (
          cartItems?.totalAmount !== undefined &&
          (cartItems?.totalAmount * 0.13).toFixed(2)
        ).toString(),
        total:
          cartItems?.totalAmount &&
          (
            3.99 +
            cartItems?.totalAmount +
            cartItems?.totalAmount * 0.13
          ).toFixed(2),
      },
      instruction: "",
      payId: "PTR12RFJ32",
      userId: user?.uid,
      orderItems: cartItems?.cartinfo.items,
      status: "Pending",
    } as Order;
    const id = await createOrder(orderInfo);
    navigate(`/success/${id}`, {
      state: "checkout",
    });
  };

  const handleAddAddress = () => {
    navigate(`/address/${user?.uid}`, {
      state: { from: "checkout" },
    });
  };

  const handleAddCard = () => {
    navigate(`/card/${user?.uid}`, {
      state: { from: "checkout" },
    });
  };

  const handleEditAddress = (id: string) => {
    navigate(`/address/${user?.uid}`, {
      state: { from: "checkout", id },
    });
  };

  const handleEditCard = (id: string) => {
    navigate(`/card/${user?.uid}`, {
      state: { from: "checkout", id },
    });
  };
  return (
    <div className=" mt-5">
      <div className="flex flex-wrap justify-evenly">
        <div className="w-full max-w-[55rem]">
          <h3 className="text-center font-bold text-xl uppercase ">Checkout</h3>
          <div className="md:border-2 md:border-gray-200 border-none rounded px-3 py-4 mt-7 mb-5 ">
            {cartItems?.items.map((item) => (
              <div key={item.id} className="m-7">
                <CartCard foodItem={item} type="checkout" />
              </div>
            ))}
          </div>
        </div>
        <div className="md:mt-0 mt-0 lg:mt-24 md:mb-5 mb-5 flex flex-col justify-start lg:mx-0 md:mx-10 mx-5 w-full xl:mx-5 xl:w-1/4 rounded-md">
          <div>
            {addresses?.length == 0 ? (
              <div>
                <span className="text-red-500">
                  <button
                    className="hover:underline cursor-pointer text-red-500  font-semibold"
                    onClick={handleAddAddress}
                  >
                    Please add address to place the order
                  </button>{" "}
                </span>
              </div>
            ) : (
              addresses?.map((address) => (
                <div className="flex justify-between">
                  <div>
                    <h4 className="text-[1rem] text-orange-500 uppercase font-bold">
                      {address.fullName}
                    </h4>
                    <h4 className="text-gray-600 text-sm font-semibold mt-2">
                      {address.street}
                    </h4>
                    <h4 className="text-gray-600 text-sm font-semibold">
                      {address.city}, {address.zipcode}
                    </h4>
                    <h4 className="text-gray-600 text-sm font-semibold">
                      {address.phone}
                    </h4>
                  </div>
                  <div className="mt-10 mr-1">
                    <button
                      className="underline tex-sm font-semibold "
                      onClick={() =>
                        address?.id && handleEditAddress(address.id)
                      }
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div>
            <div>
              {cards?.length === 0 ? (
                <div>
                  <span className="text-red-500">
                    <button
                      className="hover:underline cursor-pointer text-red-500  font-semibold"
                      onClick={handleAddCard}
                    >
                      Please add card to place the order
                    </button>{" "}
                  </span>
                </div>
              ) : (
                cards?.map((card) => (
                  <div className="flex justify-between mt-5">
                    <div>
                      <h4 className="text-[0.9rem] font-[700] uppercase text-orange-500 mb-2">
                        Card Details
                      </h4>
                      <h4 className="text-[1rem] text-gray-700 font-semibold ">
                        {card.cardholderName}
                      </h4>
                      <h4 className="text-gray-600 text-sm font-semibold">
                        {maskCardNumber(card.cardNumber)}
                      </h4>
                      <h4 className="text-gray-600 text-sm font-semibold">
                        {card.zipcode}
                      </h4>
                    </div>
                    <div className="mt-10 mr-1">
                      <button
                        className="underline tex-sm font-semibold "
                        onClick={() => card?.id && handleEditCard(card.id)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-10 ">
              <h4 className="text-[1rem] font-[700] uppercase text-orange-500 mb-2">
                Price Details
              </h4>
              <div className="">
                <div className="flex justify-between">
                  <h4 className=" text-gray-600 text-sm font-semibold">
                    Sub Total
                  </h4>
                  <h4 className="font-semibold">
                    ${cartItems?.totalAmount?.toFixed(2)}
                  </h4>
                </div>
                <div className="flex justify-between">
                  <h4 className=" text-gray-600 text-sm  font-semibold">Tax</h4>
                  <h4 className="font-semibold">
                    $
                    {cartItems?.totalAmount !== undefined &&
                      (cartItems?.totalAmount * 0.13)?.toFixed(2)}
                  </h4>
                </div>

                <div className="flex justify-between">
                  <h4 className=" text-gray-600 text-sm  font-semibold">
                    Delivery Charges
                  </h4>
                  <h4 className="font-semibold">$3.99</h4>
                </div>
                <div className="flex justify-between">
                  <h4 className="font-semibold text-[1rem] text-gray-800 mt-2">
                    Total Amount
                  </h4>
                  <h4 className="font-semibold text-[1rem] text-gray-800 mt-2">
                    $
                    {cartItems?.totalAmount !== undefined &&
                      (
                        cartItems?.totalAmount +
                        cartItems?.totalAmount * 0.13 +
                        3.99
                      ).toFixed(2)}
                  </h4>
                </div>
              </div>
            </div>
          </div>
          <button
            className="bg-black font-semibold uppercase rounded text-[1rem] px-3 py-3 mt-8 text-white"
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
