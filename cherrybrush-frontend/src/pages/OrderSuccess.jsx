import { useEffect } from "react";
import OrderDetails from "./OrderDetails";
import { LuCheck } from "react-icons/lu";
import { useParams } from "react-router-dom";
import api from "../api/axiosinstance";

function OrderSuccess() {
  const { orderId } = useParams();
  useEffect(() => {
    const sendMail = async () => {
      if (!orderId) {
        return;
      }
      const res = await api.patch(`/api/auth/send-mail/${orderId}`);
      console.log(res);
    };

    sendMail();
  }, []);

  return (
    <div>
      <div className="mx-auto">
        <div className="flex mt-7 mx-auto px-4 max-w-[1200px] items-center">
          <div className="mr-5 border rounded-full p-3 bg-green-600">
            <LuCheck className="w-10 h-10 text-white" />
          </div>
          <div className="text-xl font-bold">Order Placed Successfully!</div>
        </div>
      </div>
      <OrderDetails />
    </div>
  );
}

export default OrderSuccess;
