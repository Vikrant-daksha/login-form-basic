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
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Payment Status</th>
                <th>Total Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="">
              {orders?.length > 0 ? (
                orders.map((order, idx) => (
                  <tr key={idx}>
                    <td>#{order.order_id}</td>
                    <td>{formatDate(order.date)}</td>
                    <td>{order.name}</td>
                    <td>{order.status}</td>
                    <td>₹ {parseFloat(order.total_amount).toFixed(2)}</td>
                    <td className="commission-highlight">
                      <Link to={`/order-history/${order.order_id}`}>
                        <div className="flex justify-center">
                          <LuClipboardList className="text-sm" />
                        </div>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "32px",
                      color: "#6b7280",
                    }}
                  >
                    No orders found for this time period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default OrderHistory;
