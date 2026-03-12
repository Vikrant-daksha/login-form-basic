import { useEffect, useState } from "react";
import { TbBoxOff, TbListDetails, TbTrash } from "react-icons/tb";
import api from "../api/axiosinstance";
import { Link, useNavigate } from "react-router-dom";
import { LuClipboardList } from "react-icons/lu";

function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const orderHistory = async () => {
      const res = await api.get("/api/auth/order-history");
      setOrders(res.data);
    };

    orderHistory();
  }, []);

  useEffect(() => {
    console.log(orders);
  }, [orders]);

  if (orders) {
    if (orders.length <= 0) {
      return (
        <div className="flex flex-col h-[65vh] justify-center items-center bg-gray-100">
          <div>
            <TbBoxOff className="h-32 w-32 text-gray-500" />
          </div>
          <div className="text-sm my-3 font-semibold text-gray-500 uppercase">
            Order History Empty
          </div>
          <div className="">
            <button
              onClick={() => navigate("/catalog")}
              className="border px-2 py-1.5 bg-green-200 rounded-lg"
            >
              Order Now
            </button>
          </div>
        </div>
      );
    }
  }

  return (
    <>
      <div className="mx-5 my-4">
        <div className="text-xl mx-1 mb-5">Orders</div>
        <div className="grid grid-cols-1 gap-3">
          <div className="grid grid-cols-[50px_80px_1fr_1fr_100px] md:grid-cols-[100px_1fr_1fr_200px_100px_1fr] text-sm text-center border-b border-black pb-2">
            <div>Order NO</div>
            <div className="hidden md:flex justify-center">Date</div>
            <div>Customer</div>
            <div>Payment Status</div>
            <div>Total</div>
            <div>Actions</div>
          </div>
          {orders?.map((order) => (
            <div
              key={order.order_id}
              className="grid grid-cols-[50px_80px_1fr_1fr_100px] md:grid-cols-[100px_1fr_1fr_200px_100px_1fr] text-sm text-center py-3 border-b"
            >
              <div>{order.order_id}</div>
              <div className="hidden md:flex">{formatDate(order.date)}</div>
              <div className="truncate">{order.name}</div>
              <div>{order.status}</div>
              <div>{order.total_amount}</div>
              <div className="flex justify-evenly">
                <Link to={`/order-history/${order.order_id}`}>
                  <div>
                    <LuClipboardList className="text-sm" />
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default OrderHistory;
