import React, { useEffect, useState } from "react";
import { Timestamp, userOrders } from "../util/types";
import { getImage, handleDate } from "../util/functions";

type OrderCardProps = {
  order: userOrders;
};

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (order.restaurant?.image)
      getImage({
        imageUrl: `restaurants/${order.restaurant?.image}`,
        setImageUrl,
        setLoading,
      });
  }, [order.restaurant?.image]);

  if (loading) {
    return <div>Loading..</div>;
  }

  return (
    <div className="flex items-center flex-wrap w-full bg-white rounded  mb-10 py-4 ">
      <div className="relative w-80 h-56 md:flex-1">
        {loading ? (
          <span className="text-gray-500"></span>
        ) : imageUrl ? (
          <img
            className="w-full h-full object-contain rounded pointer-events-none"
            src={imageUrl}
            alt={order.restaurant?.name}
          />
        ) : null}
      </div>
      <div className=" mb-3 md:ml-16 md:flex-1 ">
        <h3 className="font-bold tracking-tight text-xl uppercase">
          {order.restaurant?.name}
        </h3>
        <h4 className="my-2">
          Order ID:{" "}
          <span className="font-semibold text-gray-800">{order.id}</span>
        </h4>

        <h4 className="my-3 ">
          {order.totalCount} items for ${order.orderInfo.fees.total} on{" "}
          {handleDate(order.orderInfo.createdAt as Timestamp)}
        </h4>
        {order.items.map((item) => (
          <h5 className="text-lg font-bold tracking-tight text-gray-800 truncate">
            {item.count} {item.name}
          </h5>
        ))}
      </div>
      {order.orderInfo.status === "Delivered" ||
      order.orderInfo.status === "Rejected" ||
      order.orderInfo.status === "Refund Completed" ? (
        <div className="ml-0 md:ml-10 flex-1 lg:mt-0 mt-16 ">
          <button className="w-full font-semibold bg-gray-900 rounded px-10 py-3 text-white">
            REORDER
          </button>
        </div>
      ) : (
        <div>
          <h4 className="text-right text-lg uppercase font-bold border-2 border-green-500 py-2 px-2 text-gray-900 rounded">
            Your Order is still {order.orderInfo.status}
          </h4>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
