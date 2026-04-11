import { useEffect, useState } from "react";
import api from "../api/axiosinstance";
import "./CreatorComissions.css";

function CreatorComission() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [timeFilter, setTimeFilter] = useState("today"); // today, week, month
  const [creatorCode, setCreatorCode] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const shareUrl = `${window.location.origin}?coupon=${creatorCode}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  useEffect(() => {
    const getCreatorCoupons = async () => {
      const res = await api.get("/api/auth/creator-coupons");
      console.log(res.data);
      setCreatorCode(res.data[0]?.discount_code);
    };

    getCreatorCoupons();
  }, []);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await api.get("/api/auth/orders-with-coupons");
        const data = res.data || [];

        const processedData = data.map((order) => {
          const totalAmount = parseFloat(order.total_paid) || 0;
          const commission = totalAmount * 0.05;
          return {
            ...order,
            totalAmount,
            commission,
            created_at: order.order_date
              ? new Date(order.order_date)
              : new Date(),
          };
        });

        setOrders(processedData);
        filterData(processedData, "today");
      } catch (error) {
        console.error("Failed to fetch commissions", error);
      }
    };

    getOrders();
  }, []);

  const filterData = (data, filterType) => {
    const now = new Date();
    const filtered = data.filter((order) => {
      const orderDate = new Date(order.created_at);

      if (filterType === "today") {
        return orderDate.toDateString() === now.toDateString();
      } else if (filterType === "week") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return orderDate >= oneWeekAgo && orderDate <= now;
      } else if (filterType === "month") {
        return (
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      }
      return true;
    });

    setFilteredOrders(filtered);
    setTimeFilter(filterType);
  };

  const handleFilterClick = (filter) => {
    filterData(orders, filter);
  };

  // Calculate totals for top cards
  const totalOrdersAmount = filteredOrders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );
  const totalCommission = filteredOrders.reduce(
    (sum, order) => sum + order.commission,
    0
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Commission Analytics</h1>
        <div className="time-filters">
          <button
            className={`filter-btn ${timeFilter === "today" ? "active" : ""}`}
            onClick={() => handleFilterClick("today")}
          >
            Today
          </button>
          <button
            className={`filter-btn ${timeFilter === "week" ? "active" : ""}`}
            onClick={() => handleFilterClick("week")}
          >
            This Week
          </button>
          <button
            className={`filter-btn ${timeFilter === "month" ? "active" : ""}`}
            onClick={() => handleFilterClick("month")}
          >
            This Month
          </button>
        </div>
      </div>
      {creatorCode ? (
        <div className="share-section bg-secondary">
          <div className="section-header">
            <h2 className="section-title">Your Creator Code</h2>
            <p className="section-subtitle">
              Share this link with your audience. When they buy using this link,
              the coupon is automatically applied and you earn commission!
            </p>
          </div>
          <div className="link-card">
            <div className="link-display">
              <span className="link-text">{shareUrl}</span>
            </div>
            <button
              className={`copy-btn bg-primary ${copySuccess ? "success" : ""}`}
              onClick={copyToClipboard}
            >
              {copySuccess ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>
      ) : (
        <div className="share-section bg-secondary">
          <div className="section-header">
            <h2 className="section-title">No Creator Code Available</h2>
            <p className="section-subtitle">
              Apply for Creator Coupon to Unlock comissions.
            </p>
          </div>
        </div>
      )}

      <div className="metrics-grid">
        <div className="metric-card">
          <span className="metric-title">
            Total Orders Amount ({timeFilter})
          </span>
          <span className="metric-value">₹{totalOrdersAmount.toFixed(2)}</span>
        </div>
        <div className="metric-card">
          <span className="metric-title">Total Commission Earned (5%)</span>
          <span className="metric-value commission-highlight">
            ₹{totalCommission.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer ID</th>
              <th>Total Paid</th>
              <th>Discount Applied</th>
              <th>Commission (5%)</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, idx) => (
                <tr key={idx}>
                  <td>#{order.order_id}</td>
                  <td>{order.customer_id}</td>
                  <td>₹{order.totalAmount.toFixed(2)}</td>
                  <td>₹{parseFloat(order.discount || 0).toFixed(2)}</td>
                  <td className="commission-highlight">
                    ₹{order.commission.toFixed(2)}
                  </td>
                  <td>{order.created_at.toLocaleDateString()}</td>
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
  );
}

export default CreatorComission;
