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

  const handleEditAddress = (id: string) => {
    navigate(`/address/${user?.uid}`, {
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
        <div className="mt-24 flex flex-col justify-start lg:mx-0 md:mx-10 mx-5 lg:w-1/4 md:w-full w-full rounded-md">
          <div>
            {addresses?.map((address) => (
              <div className="flex justify-between">
                <div>
                  <h4 className="text-[1rem] text-gray-700 uppercase font-bold">
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
                    onClick={() => address?.id && handleEditAddress(address.id)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 ">
            <h4 className="text-[1rem] font-[700] uppercase text-gray-800 mb-2">
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
