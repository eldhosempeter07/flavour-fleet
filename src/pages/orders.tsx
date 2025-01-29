import React, { useContext, useEffect, useState } from "react";
import { getOrders } from "../util/user";
import { AuthContext } from "../util/authContext";
import { Order, userOrders } from "../util/types";

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
    <div>
      <h4>Orders</h4>

      {orders?.map((order) => (
        <>
          {order.items.map((item) => (
            <>
              <h4>
                {item.name} - {item.price}
              </h4>
            </>
          ))}
        </>
      ))}
    </div>
  );
};

export default Orders;
