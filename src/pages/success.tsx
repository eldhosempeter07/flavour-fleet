import React, { useContext, useEffect, useState } from "react";
import { AddressType } from "../util/types";
import { getAddresses } from "../util/user";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { AuthContext } from "../util/context/authContext";

const Success = () => {
  const { id } = useParams();
  const location = useLocation();
  const [addresses, setAddresses] = useState<AddressType[] | undefined>(
    undefined
  );

  const { user } = useContext(AuthContext) ?? {
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

  if (location.state !== "checkout") {
    return <Navigate to="/" />;
  }
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h4 className="text-2xl  font-bold text-green-500 uppercase mb-4 leading-tight tracking-tight">
        Your Order is On Its Way! 🍽️
      </h4>
      <p className="font-semibold text-xl mb-4 w-[50rem] text-center mt-5 text-orange-600 ">
        Thank you for your order! We're preparing your delicious meal with care,
        and it'll be on its way to you soon.
      </p>

      <div className="mb-5">
        <a
          href={`/orders/${user?.uid}`}
          className="underline font-semibold text-lg "
        >
          Click To View Order Details
        </a>
      </div>

      {addresses?.map((address) => (
        <div>
          <h4 className="text-gray-800 font-semibold">Delivery Address 🏠 </h4>
          <h4 className="text-gray-700 ">{address.fullName}</h4>
          <h4 className="text-gray-700 ">
            {address.street}, {address.city}, {address.zipcode} {address.phone}
          </h4>
        </div>
      ))}
      <div className="w-[35rem] mt-4">
        <div className="flex justify-between items-center">
          <h4>Order ID</h4>
          <h4 className=" text-gray-800 font-semibold">{id}</h4>
        </div>

        <div className="flex justify-between items-center my-3">
          <h4>Estimated Delivery Time ⏳ </h4>
          <h4 className="text-gray-800 font-semibold">45 minutes</h4>
        </div>
      </div>
    </div>
  );
};

export default Success;
