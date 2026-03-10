import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosinstance";
import "./OrderDetails.css";

function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOrderById = async () => {
      try {
        const res = await api.get(`/api/auth/order-history/${orderId}`);
        setOrder(res.data);
        console.log("Order Data:", res.data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    getOrderById();
  }, [orderId]);

  if (loading) return <div className="loading">Loading order details...</div>;
  if (!order || order.length === 0)
    return <div className="no-order">Order not found.</div>;

  // Since order is an array of items with common order info,
  // we extract the general info from the first item
  const commonInfo = order[0];
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="order-details-container">
      <h1 className="order-title">Order Details #{commonInfo.order_id}</h1>

      <div className="order-details-grid">
        {/* Left Columns (Spans 2) */}
        <div className="order-details-left">
          {/* Upper Section: Shipping and Order Summary */}
          <div className="info-card">
            <h2 className="info-card-title">Shipping & Order Info</h2>
            <div className="shipping-info-grid">
              <div className="info-item">
                <label>Recipient</label>
                <p>{commonInfo.recipient}</p>
              </div>
              <div className="info-item">
                <label>Order Date</label>
                <p>{formatDate(commonInfo.order_date)}</p>
              </div>
              <div className="info-item">
                <label>Shipping Address</label>
                <p>
                  {commonInfo.apartment}, {commonInfo.address}
                  <br />
                  {commonInfo.area && <span>{commonInfo.area}, </span>}
                  {commonInfo.city}, {commonInfo.state} - {commonInfo.pincode}
                </p>
              </div>
              <div className="info-item">
                <label>Contact Number</label>
                <p>{commonInfo.mobile}</p>
              </div>
              <div className="info-item">
                <label>Order ID</label>
                <p>#{commonInfo.order_id}</p>
              </div>
              <div className="info-item">
                <label>Total Amount</label>
                <p>₹{parseFloat(commonInfo.total_amount).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Lower Section: Order Items */}
          <div className="info-card">
            <h2 className="info-card-title">Order Items</h2>
            <div className="order-items-list">
              {order.map((item, index) => (
                <div key={index} className="order-item-card">
                  <img
                    src={item.image && item.image[0]}
                    alt={item.name}
                    className="item-image"
                  />
                  <div className="item-details">
                    <p className="item-name">{item.name}</p>
                    <div className="item-meta">
                      {item.color && <span>Color: {item.color}</span>}
                      {item.shape && <span>Shape: {item.shape}</span>}
                      {item.size && <span>Size: {item.size}</span>}
                    </div>
                    <p className="item-quantity">Qty: {item.quantity}</p>
                  </div>
                  <div className="item-pricing">
                    <p className="item-price">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <p className="item-unit-price">₹{item.price} each</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary-total">
              <span className="total-label">Grand Total:</span>
              <span className="total-amount">
                ₹{parseFloat(commonInfo.total_amount).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (Spans 1) */}
        <div className="order-details-right">
          <div className="info-card">
            <h2 className="info-card-title">Transaction Info</h2>
            <div className="transaction-details">
              <div className="info-item">
                <label>Transaction ID</label>
                <p className="txn-id">{commonInfo.txn_id}</p>
              </div>
              <div className="info-item">
                <label>Payment Method</label>
                <p style={{ textTransform: "capitalize" }}>
                  {commonInfo.payment_method}
                </p>
              </div>
              <div className="info-item">
                <label>Payment Status</label>
                <span
                  className={`status-badge status-${commonInfo.payment_status}`}
                >
                  {commonInfo.payment_status}
                </span>
              </div>
              <div className="info-item">
                <label>Order Status</label>
                <span className={`status-badge status-${commonInfo.status}`}>
                  {commonInfo.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
