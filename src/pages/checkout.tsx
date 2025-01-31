import React, { useContext, useEffect, useState } from "react";
import { AddressType, Cart, Order } from "../util/types";
import { createOrder, getAddresses, getCartItems } from "../util/user";
import { AuthContext } from "../util/authContext";
import { useNavigate } from "react-router-dom";
import CartCard from "../components/cartCard";

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
      fees: {
        deliveryFee: "3.99",
        subTotal: cartItems?.totalAmount.toString(),
        tax: (
          cartItems?.totalAmount !== undefined &&
          (cartItems?.totalAmount * 0.13).toFixed(2)
        ).toString(),
      },
      instruction: "",
      payId: "PTR12RFJ32",
      userId: user?.uid,
      orderItems: cartItems?.cartinfo.items,
    } as Order;
    const id = await createOrder(orderInfo);
    console.log(id);
    navigate(`/success/${id}`);
  };

  return (
    <div className=" mt-5">
      <div className="flex justify-evenly">
        <div className="w-full max-w-[55rem]">
          <h3 className="text-center font-bold text-xl uppercase ">Checkout</h3>
          <div className="border-2 border-gray-200 rounded px-3 py-4 mt-10 ">
            {/* <a
              href={`/restaurant/${cartItems?.cartinfo?.restarantId}`}
              className="ml-5 font-bold text-gray-800 underline uppercase text-xl"
            >
              {cartItems?.resturant?.name}
            </a> */}
            {cartItems?.items.map((item) => (
              <div key={item.id} className="m-7">
                <CartCard foodItem={item} type="checkout" />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-24 flex flex-col justify-start w-1/4 rounded-md">
          <div>
            {addresses?.map((address) => (
              <div className="flex justify-between">
                <div>
                  <h4 className="text-lg text-gray-700 uppercase font-bold">
                    {address.fullName}
                  </h4>
                  <h4 className="text-gray-600 font-semibold mt-2">
                    {address.street}
                  </h4>
                  <h4 className="text-gray-600 font-semibold">
                    {address.city}, {address.zipcode}
                  </h4>
                  <h4 className="text-gray-600 font-semibold">
                    {address.phone}
                  </h4>
                </div>
                <div className="mt-10 mr-5">
                  <a
                    className="underline tex-lg font-semibold "
                    href={`/address/${user?.uid}`}
                  >
                    Edit
                  </a>
                </div>
              </div>
            ))}
          </div>
          {/* <div className="mt-10">
            <input
              type="text"
              placeholder="Coupons"
              className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
            />
          </div> */}

          <div className="mt-10 ">
            <h4 className="text-lg font-[700] uppercase text-gray-800 mb-2">
              Price Details
            </h4>
            <div className="">
              <div className="flex justify-between">
                <h4 className=" text-gray-600 ">Sub Total</h4>
                <h4 className="font-semibold"> ${cartItems?.totalAmount}</h4>
              </div>
              <div className="flex justify-between">
                <h4 className=" text-gray-600">Tax</h4>
                <h4 className="font-semibold">
                  $
                  {cartItems?.totalAmount !== undefined &&
                    (cartItems?.totalAmount * 0.13)?.toFixed(2)}
                </h4>
              </div>

              <div className="flex justify-between">
                <h4 className=" text-gray-600">Delivery Charges</h4>
                <h4 className="font-semibold">$3.99</h4>
              </div>
              <div className="flex justify-between">
                <h4 className="font-semibold text-lg text-gray-800 mt-2">
                  Total Amount
                </h4>
                <h4 className="font-semibold text-lg text-gray-800 mt-2">
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
          <button
            className="bg-black uppercase rounded px-3 py-3 mt-10 text-white"
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>
        </div>
      </div>

      {/* <button
        className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-white mt-4"
      >
        Place Order
      </button> */}
    </div>
  );
};

export default Checkout;
