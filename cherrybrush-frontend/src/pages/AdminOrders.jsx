import { useEffect, useState } from "react";
import { TbBoxOff, TbListDetails, TbTrash } from "react-icons/tb";
import api from "../api/axiosinstance";
import { Link, useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { LuClipboardList } from "react-icons/lu";

function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState(null);
  const [deletePopUp, setDeletePopUP] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const deleteOrder = async (order_id) => {
    const res = await api.delete(`/api/auth/order/${order_id}`);
    setOrders((orders) => orders.filter((o) => !(o.order_id === order_id)));
    console.log(res.data);
  };

  useEffect(() => {
    const orderHistory = async () => {
      const res = await api.get("/api/auth/order-history/admin");
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
      {deletePopUp && (
        <div className="flex justify-center items-center fixed top-0 left-0 w-full h-full z-50 backdrop-blur-[2px]">
          <div className="w-4/5 sm:w-1/2 h-max bg-white border border-black rounded-xl">
            <div className="m-4">
              <div className="flex justify-between items-center mb-1">
                <div className="text-lg text-red-600">
                  Do you want to Delete this Product?
                </div>
                <div>
                  <button
                    onClick={() => {
                      setDeletePopUP(false);
                    }}
                    className="text-xl"
                  >
                    <IoMdClose />
                  </button>
                </div>
              </div>
              <div className="w-full border-b mb-2"></div>
              <div className="flex flex-col mx-5">
                <div className="">
                  <p className="text-lg text-left font-medium">
                    Do you really want to delete this Product?
                  </p>
                  <p className="text-lg text-left font-light">
                    This action will delete the product from everywhere such as
                    customers cart and products page.
                  </p>
                </div>
                <div className="text-sm font-semibold text-red-500 my-3">
                  *This Action is Irreversible!
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setDeletePopUP(false);
                  }}
                  className="w-full border border-black py-1.5 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteOrder(orderId);
                    setDeletePopUP(false);
                  }}
                  className="w-full border border-red-600 bg-red-600 text-white py-1.5 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="mx-5 my-4">
        <div className="text-xl mx-1 mb-5">Orders</div>
        <div className="grid grid-cols-1 gap-3">
          <div className="grid grid-cols-[100px_1fr_1fr_200px_100px_1fr] text-sm text-center border-b border-black pb-2">
            <div>Order NO</div>
            <div>Date</div>
            <div>Customer</div>
            <div>Payment Status</div>
            <div>Total</div>
            <div>Actions</div>
          </div>
          {orders?.map((order) => (
            <div
              key={order.order_id}
              className="grid grid-cols-[100px_1fr_1fr_200px_100px_1fr] text-sm text-center py-3 border-b"
            >
              <div>{order.order_id}</div>
              <div>{formatDate(order.date)}</div>
              <div>{order.name}</div>
              <div>{order.status}</div>
              <div>{order.total_amount}</div>
              <div className="flex justify-evenly">
                <Link to={`/order-history/${order.order_id}`}>
                  <div>
                    <LuClipboardList className="text-sm" />
                  </div>
                </Link>
                <button
                  onClick={() => {
                    setOrderId(order.order_id);
                    setDeletePopUP(true);
                    // deleteOrder(order.order_id);
                  }}
                >
                  <TbTrash className="text-sm text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default AdminOrders;
