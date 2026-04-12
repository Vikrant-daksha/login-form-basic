import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import api from "../api/axiosinstance";
import { MdDiscount } from "react-icons/md";
import { LucideUser2 } from "lucide-react";

function DiscountPage() {
  const [code, setCode] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [percent, setPercent] = useState("");
  const [expireAt, setExpiresAt] = useState("");
  const [maxRedemptions, setMaxRedemptions] = useState("");
  const [maxPerUser, setMaxPerUser] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const [coupons, setCoupons] = useState([]);
  const [activeTab, setActiveTab] = useState("Active Coupons");

  const tabs = [
    "Active Coupons",
    "Creator Coupon",
    "Used Coupons",
    "Expired Coupons",
  ];

  useEffect(() => {
    const getAllCoupons = async () => {
      try {
        const res = await api.get("/api/auth/all-coupons");
        if (res.data && res.data.length > 0) {
          setCoupons(res.data);
        }
      } catch (error) {
        console.error("Failed to load coupons", error);
      }
    };
    getAllCoupons();
  }, []);

  const searchUsers = async (searchThis) => {
    if (searchThis.length === 0) return [];
    try {
      const res = await api.get(`/api/auth/get-user/search?q=${searchThis}`);
      return res.data.map((user) => ({
        value: user.user_id,
        label: `${user.username} (${user.email})`,
      }));
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  const handleChange = (user) => {
    setSelectedUser(user);
  };

  const submitCoupon = async (e) => {
    e.preventDefault();
    const couponInfo = {
      coupon_code: code || null,
      coupon_description: desc || null,
      coupon_price: price || null,
      coupon_percent: percent || null,
      referal_id: selectedUser ? selectedUser.value : null,
      expires_at: expireAt || null,
      max_redemption: maxRedemptions || null,
      max_redemption_per_user: maxPerUser || null,
    };

    try {
      const res = await api.post("/api/auth/create-coupon", couponInfo);
      console.log("Coupon Created:", res.data);
      clearForm();
    } catch (error) {
      console.error("Error creating coupon", error);
    }
  };

  const clearForm = () => {
    setCode("");
    setDesc("");
    setPrice("");
    setPercent("");
    setExpiresAt("");
    setMaxRedemptions("");
    setMaxPerUser("");
    setSelectedUser(null);
  };

  useEffect(() => {
    console.log("Coupons Loaded:", coupons);
  }, [coupons]);

  const filteredCoupons = coupons.filter((coupon) => {
    const now = new Date();
    const expiresAt = coupon.expires_at ? new Date(coupon.expires_at) : null;
    const isExpired = expiresAt && expiresAt < now;
    const isFullyUsed =
      coupon.max_redemption &&
      coupon.current_usage_count >= coupon.max_redemption;

    switch (activeTab) {
      case "Active Coupons":
        return !isExpired && !isFullyUsed;
      case "Creator Coupon":
        return coupon.referal_id !== null;
      case "Used Coupons":
        return isFullyUsed;
      case "Expired Coupons":
        return isExpired;
      default:
        return true;
    }
  });

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      {/* 1. Form Section */}
      <section className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Create New Discount Coupon
        </h2>
        <form onSubmit={submitCoupon} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Code */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1">
                Coupon Code
              </label>
              <input
                type="text"
                placeholder="e.g. SAVE20"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Description */}

            {/* Price Discount */}
            <div className="flex flex-col w-full">
              <label className="text-sm font-semibold text-gray-700 mb-1">
                Discount Amount ($)
              </label>
              <input
                type="number"
                placeholder="Fixed amount off"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                placeholder="Brief details about the coupon"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            {/* Percent Discount
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1">
                Discount Percent (%)
              </label>
              <input
                type="number"
                placeholder="Percentage off"
                value={percent}
                onChange={(e) => setPercent(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div> */}

            {/* Expire Date */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1">
                Expires At
              </label>
              <input
                type="date"
                value={expireAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Max Redemptions Global */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1">
                Max Redemptions (Total)
              </label>
              <input
                type="number"
                placeholder="Total times this can be used globally"
                value={maxRedemptions}
                onChange={(e) => setMaxRedemptions(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Max Redemptions Per User */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1">
                Max Redemptions (Per User)
              </label>
              <input
                type="number"
                placeholder="Limit for a single user"
                value={maxPerUser}
                onChange={(e) => setMaxPerUser(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Referral / User link */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1">
                Referral User (Optional)
              </label>
              <AsyncSelect
                cacheOptions
                loadOptions={searchUsers}
                defaultOptions
                onChange={handleChange}
                value={selectedUser}
                classNames={{
                  control: () => "p-1.5 border-gray-300 rounded-lg",
                }}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-green-700 transition duration-200"
            >
              Create Coupon
            </button>
          </div>
        </form>
      </section>

      {/* 2. Coupon Display Section with Tabs */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Manage Your Coupons
          </h2>

          {/* Tab Menu */}
          <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-300 hover:text-gray-500 hover:bg-gray-100/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {filteredCoupons.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 text-lg">
              No {activeTab.toLowerCase()} found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoupons.map((coupon) => (
              <div
                key={coupon?.id}
                className="group transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`rounded-2xl p-1 border border-gray-100 shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden ${
                    activeTab === "Expired Coupons"
                      ? "bg-red-400"
                      : activeTab === "Used Coupons"
                      ? "bg-gray-400"
                      : "bg-green-200"
                  }`}
                >
                  {/* Decorative Gradient Background */}
                  {/* <div className={`absolute top-0 left-0 w-full h-1.5 ${activeTab === "Expired Coupons" ? "bg-red-400" :
                      activeTab === "Used Coupons" ? "bg-gray-400" : "bg-blue-500"
                    }`} /> */}

                  <div className="bg-gray-50 rounded-xl p-6 relative h-64">
                    {/* Badge */}
                    <div
                      className={`absolute top-4 right-4 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${
                        activeTab === "Expired Coupons"
                          ? "bg-red-500"
                          : "bg-black"
                      }`}
                    >
                      {coupon?.discount_percent
                        ? `${coupon.discount_percent}% OFF`
                        : coupon?.discount_price
                        ? `₹${coupon.discount_price} OFF`
                        : "DISCOUNT"}
                    </div>

                    <div className="text-lg font-bold text-gray-900 mb-2">
                      {/* {coupon?.discount_description || "Special Offer"} */}
                      {coupon?.referal_id ? (
                        <div>
                          <span className="flex items-center w-fit text-[16px] px-4 py-1.5 bg-gray-200 rounded-md">
                            <LucideUser2 className="mr-2 h-4" /> Creator Coupon
                          </span>
                          <span className="text-sm px-3 font-light">
                            Linked to Creator: {coupon.creator_name}
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="flex items-center w-fit text-[16px] px-4 py-1.5 bg-gray-200 rounded-md">
                            <MdDiscount className="mr-2 h-4" /> Discount Coupon
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-6">
                      <div className="bg-white border border-dashed border-primary text-gray-600 font-mono text-center py-2 px-4 rounded-lg font-bold tracking-widest flex-1">
                        {coupon?.discount_code}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">Usage Progress</span>
                        <span className="font-semibold text-gray-700">
                          {coupon?.current_usage_count || 0} /{" "}
                          {coupon?.max_redemption || "∞"}
                        </span>
                      </div>

                      {/* Simple Progress Bar */}
                      {coupon?.max_redemption && (
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-500 h-1.5 rounded-full"
                            style={{
                              width: `${Math.min(
                                (coupon.current_usage_count /
                                  coupon.max_redemption) *
                                  100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      )}

                      <div className="flex justify-between items-center text-xs pt-1">
                        <div>
                          <p className="text-gray-400">Expires</p>
                          <p className="font-medium text-gray-700">
                            {coupon?.expires_at
                              ? new Date(coupon.expires_at).toLocaleDateString()
                              : "Never"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400">Limit/User</p>
                          <p className="font-medium text-gray-700">
                            {coupon?.redemption_per_user || 1} Time
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default DiscountPage;
