import { useEffect, useState } from "react";
import api from "../api/axiosinstance";

function OrderHistory() {
  const [orders, setOrders] = useState(null);

  const getOrder = async (order_id) => {
    const res = await api.get(`/api/auth/order-history/${order_id}`);

    console.log(res.data);
  };

  useEffect(() => {
    const orderHistory = async () => {
      const res = await api.get("/api/auth/order-history");
      setOrders(res.data);
      console.log(res.data);
    };

    orderHistory();
  }, []);

  useEffect(() => {
    console.log(orders);
  }, [orders]);

  return (
    <>
      <div>
        <div>Hello</div>
        {orders?.map((order) => (
          <div key={order.id} className="mb-3">
            <div>{order.id}</div>
            <div>{order.total_amount}</div>
            <div>{order.payment_method}</div>
            <div>{order.status}</div>
            <div>{order.created_at}</div>
            <button
              onClick={() => {
                getOrder(order.id);
              }}
            >
              Get This Order
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default OrderHistory;
