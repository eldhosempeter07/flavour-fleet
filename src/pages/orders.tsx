import React, { useContext, useEffect, useState } from "react";
import { getOrders } from "../util/user";
import { AuthContext } from "../util/context/authContext";
import { Order, userOrders } from "../util/types";
import OrderCard from "../components/orderCard";

const Orders = () => {
  const { user, loading } = useContext(AuthContext) ?? {
    user: null,
    loading: false,
  };

  const [orders, setOrders] = useState<userOrders[] | null>(null);
  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.uid) {
        const userOrders = await getOrders(user?.uid);
        console.log(userOrders);

        setOrders(userOrders);
      }
    };

    fetchOrders();
  }, [user]);

  return (
    <div className="flex justify-center ">
      <>
        <div className="w-full max-w-6xl">
          <h3 className="text-center font-bold text-lg uppercase ">Orders</h3>
          <div className=" rounded px-3 py-4 mt-10 ">
            {orders?.map((order) => (
              <>
                <OrderCard order={order} />
              </>
            ))}
          </div>
        </div>
      </>
    </div>
  );
};

export default Orders;
