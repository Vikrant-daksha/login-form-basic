import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import api from "../api/axiosinstance";

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
        label: `User: ${user.username} (${user.email})`,
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
    console.log("Coupon:", coupons);
  }, [coupons]);

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

            {/* Price Discount */}
            <div className="flex flex-col">
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

            {/* Percent Discount */}
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
            </div>

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
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Create Coupon
            </button>
          </div>
        </form>
      </section>

      {/* 2. Coupon Display Tiles / Cards */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Coupon Configurations Preview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {coupons &&
            coupons.map((coupon) => (
              <div key={coupon?.id} className="space-y-8">
                <div>
                  <div className="bg-white rounded-2xl p-1 border border-gray-200 shadow-sm max-w-full">
                    <div className="bg-gray-50 rounded-xl p-6 relative h-full">
                      <div className="absolute top-4 right-4 bg-black text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                        {coupon?.coupon_percent
                          ? `${coupon.coupon_percent}% OFF`
                          : "DISCOUNT"}
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mt-4 mb-2">
                        {coupon?.discount_description || "Special Offer"}
                      </h4>
                      <div className="bg-gray-200 text-gray-800 font-mono text-center py-2 px-4 rounded-lg font-semibold tracking-widest mb-4">
                        {coupon?.discount_code}
                      </div>
                      <hr className="border-gray-200 mb-4" />
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <div>
                          <p className="font-semibold text-gray-700">Limits</p>
                          <p>
                            {coupon?.max_redemption || "Unlimited"} uses total
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-700">
                            Per User
                          </p>
                          <p>{coupon?.redemption_per_user || 1} time(s)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}

export default DiscountPage;
