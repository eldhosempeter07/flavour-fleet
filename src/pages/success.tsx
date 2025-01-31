import React, { useContext, useEffect, useState } from "react";
import { AddressType, Order, userOrders } from "../util/types";
import { getAddresses, getOrderById } from "../util/user";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../util/authContext";

const Success = () => {
  const { id } = useParams();
  const [addresses, setAddresses] = useState<AddressType[] | undefined>(
    undefined
  );

  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext) ?? {
    user: null,
    loading: true,
  };

  const fetchAddresses = async () => {
    if (user?.uid) {
      const addresses = await getAddresses(user?.uid);
      if (addresses) {
        setAddresses(addresses);
      }
    }
  };
  useEffect(() => {
    fetchAddresses();
  }, [user?.uid]);

  console.log(addresses);

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h4 className="text-2xl font-bold text-green-500 uppercase mb-4 leading-tight tracking-tight">
        Your Order is On Its Way! 🍽️
      </h4>
      <p className="font-semibold text-xl mb-4 w-[50rem] text-center mt-5 ">
        Thank you for your order! We're preparing your delicious meal with care,
        and it'll be on its way to you soon.
      </p>

      <div>
        <a href={`/order/${id}`} className="underline font-semibold text-lg">
          View Order Details
        </a>
      </div>

      {addresses?.map((address) => (
        <div>
          <h4>Delivery Address: </h4>
          <h4 className="text-gray-800 font-semibold">
            {address.fullName} {address.street},{address.city}
            {address.zipcode} {address.phone}
          </h4>
        </div>
      ))}
      <div className="w-[35rem] mt-4">
        <div className="flex justify-between items-center">
          <h4>Order ID</h4>
          <h4 className=" text-gray-800 font-semibold">{id}</h4>
        </div>

        <div className="flex justify-between items-center my-3">
          <h4>
            <span className="text-gray-800 font-semibold">
              Estimated Delivery Time:{" "}
            </span>
          </h4>
          <h4>45 minutes Delivery</h4>
        </div>
      </div>

      <div>
        <h4 className="w-[60rem] text-center text-gray-800 font-semibold">
          In the meantime, relax and look forward to your meal! If you need any
          assistance, feel free to contact our support team at [Support
          Email/Phone Number]. Thanks for choosing us! We can't wait to serve
          you again
        </h4>
      </div>
    </div>
  );
};

export default Success;
