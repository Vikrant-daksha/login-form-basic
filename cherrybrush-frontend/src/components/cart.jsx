import { useEffect, useState } from "react";
import { useAuth } from "../context/Authcontext.jsx";
import api from "../api/axiosinstance.jsx";
import { TbShoppingCartCancel, TbTrash } from "react-icons/tb";
import { IconContext } from "react-icons";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { load } from "@cashfreepayments/cashfree-js";
import { MdDiscount } from "react-icons/md";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [coupons, setCoupons] = useState(null);
  const [discountCode, setDiscountCode] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const { user } = useAuth();

  const MAX_VAL = 1000;

  const setQuantity = (productId, value) => {
    setCart((prev) =>
      prev.map((item) =>
        item.cart_items_id === productId
          ? { ...item, quantity: Number(value) }
          : item
      )
    );
  };

  const updateCartItem = async (productId, variantId, quantity) => {
    let newQuantity;

    if (Number(quantity) <= 0) {
      removeCartItem(productId);
      return;
    } else {
      newQuantity = Number(quantity);
    }

    if (newQuantity > MAX_VAL) {
      newQuantity = MAX_VAL;
    }

    setCart((cart) =>
      cart?.map((item) =>
        item?.cart_items_id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );

    const res = await api.patch("/api/update-quantity", {
      productId,
      product_variant_id: variantId,
      quantity: newQuantity,
    });
  };

  const removeCartItem = async (productId) => {
    const res = await api.delete(`/api/remove/${productId}`);

    setCart((cart) =>
      cart.filter((item) => !(item.cart_items_id === productId))
    );

    console.log(res.data);
  };

  const handleLocalChange = (productId, value) => {
    if (value === "") {
      setQuantity(productId, "");
      return;
    }

    // Allow only digits
    if (/^\d+$/.test(value)) {
      setQuantity(productId, Number(value));
    }
  };

  const handleCheckout = async () => {
    if (cart) {
      navigate(`/checkout?cartId=${cart[0].cart_id}`);
    }
  };

  const checkDiscount = async (code) => {
    if (!code) return;
    const res = await api.get(`/api/auth/coupon/${code}`);
    console.log(res.data.id);
    setSelectedCoupon(res.data);
    setDiscount(res.data.discount_price);
  };

  const handleDiscount = async (code) => {
    try {
      const res = await api.get(`/api/auth/coupon/${code}`);
      if (!res.data.id)
        return alert(`No Coupon with the '${code}' Code Found.`);
      const cartCoupon = await api.post(`/api/auth/cart-coupon/${res.data.id}`);
      console.log("Coupon Added to Cart ", cartCoupon.data);
      if (!cartCoupon.data.message) {
        setSelectedCoupon(res.data);
        setDiscount(res.data.discount_price);
      } else {
        alert(cartCoupon.data.message);
      }
    } catch (err) {
      console.error("Error", err);
    }
    console.log(`Dicount Id ${code}`);
  };

  const removeDiscount = async (id) => {
    const res = await api.delete(`/api/auth/delete-cart-coupon`);
    console.log(res.data);
    setSelectedCoupon(null);
    console.log(id);
  };

  useEffect(() => {
    const getCreatorCoupon = async () => {
      if (cart.length > 0) {
        const creatorCoupon = localStorage.getItem("creatorCoupon");
        console.log(creatorCoupon);
        if (!creatorCoupon || creatorCoupon === null) return;
        if (creatorCoupon.length > 0) {
          setSelectedCoupon(null);
          handleDiscount(creatorCoupon);
          localStorage.removeItem("creatorCoupon");
        }
      }
    };

    getCreatorCoupon();
  }, [cart]);

  useEffect(() => {
    const getDiscounts = async () => {
      const res = await api.get("/api/auth/coupons");
      setCoupons(res.data);
      console.log(res.data);
    };

    getDiscounts();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchCart = async () => {
      try {
        const res = await api.get("/api/auth/cart");
        if (!res.data) {
          console.log("Error fetching Cart");
          return;
        }
        setCart(res.data);
        if (!res.data[0].coupon_code) return;
        checkDiscount(res.data[0].coupon_code);
      } catch (err) {
        console.log("Error Adding to cart", err);
      }
    };

    fetchCart();
  }, [user]);

  useEffect(() => {
    if (cart) {
      const cartTotal = cart.reduce(
        (acc, item) => acc + parseFloat(item.price * item.quantity),
        0
      );
      setSubTotal(cartTotal);
    }
  }, [cart]);

  useEffect(() => {
    console.log(subTotal);
  }, [subTotal]);

  useEffect(() => {
    console.log(cart);
  }, [cart]);

  if (cart.length == 0) {
    return (
      <div className="h-[89vh] bg-gray-50">
        <div
          id="cart-items"
          className="h-full w-full flex justify-center items-center"
        >
          <div
            id="cart-placeholder"
            className="flex flex-col justify-center items-center "
          >
            <div className="react-icon mb-1.5">
              <IconContext.Provider
                value={{ size: "3rem", color: "gray", className: "stroke-2" }}
              >
                <div>
                  <TbShoppingCartCancel />
                </div>
              </IconContext.Provider>
            </div>
            <div className="text-[14px] text-[#808080] uppercase pb-6">
              Cart is Empty, Fill with Care
            </div>
            <div>
              <Link to={"/catalog"}>
                <button className="text-[12px] text-secondary rounded-[5px] px-4 py-2.5 bg-primary">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="grid gap-4 px-3 py-3 sm:my-9 sm:border sm:mx-6 sm:px-6 sm:rounded-xl sm:py-6">
        <div className="ml-1">My Cart</div>
        {cart?.map((elem) => (
          <div key={`${elem?.cart_items_id}`} className="">
            <div className="grid grid-cols-4 items-center px-1 py-1 w-full border border-solid rounded-xl">
              <div className="grid grid-cols-2 items-center">
                <div className="overflow-hidden rounded-xl p-0.5 border mr-1 sm:mr-3 w-fit">
                  <Link to={`/products/${elem?.slug}`}>
                    <div className="relative">
                      {elem?.sale && (
                        <div className="absolute top-0 left-0 bg-black overflow-hidden rounded-br-md">
                          <div className="overflow-clip text-white text-center text-[10px] sm:text-xs px-0.5 py-0.5 sm:px-1 sm:py-0.5 ">
                            S
                          </div>
                        </div>
                      )}
                    </div>
                    <img
                      src={
                        elem?.images?.[0]?.replace(
                          "/upload",
                          "/upload/w_80,h_80,c_fill/"
                        ) || logo
                      }
                      width={80}
                      height={80}
                      className="rounded-lg min-h-fit"
                    ></img>
                  </Link>
                </div>
                <div className="truncate">
                  {elem?.product}
                  {elem?.product_variant_id !== null && (
                    <div className="text-[8px] text-gray-400 font-medium tracking-tight uppercase">
                      {elem.size} {elem.color} <p>{elem.shape}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-center items-center">
                <div className="w-1/2 flex">
                  <button
                    onClick={() => {
                      updateCartItem(
                        elem?.cart_items_id,
                        elem?.product_variant_id,
                        Number(elem?.quantity) - 1
                      );
                    }}
                    className="border px-1"
                  >
                    -
                  </button>
                  <input
                    type="text"
                    maxLength={MAX_VAL}
                    className="w-full text-center"
                    value={elem.quantity}
                    onChange={(e) =>
                      handleLocalChange(elem.cart_items_id, e.target.value)
                    }
                    onBlur={(e) =>
                      updateCartItem(
                        elem.cart_items_id,
                        elem.product_variant_id,
                        Number(e.target.value)
                      )
                    }
                  />
                  <button
                    onClick={() => {
                      updateCartItem(
                        elem?.cart_items_id,
                        elem?.product_variant_id,
                        Number(elem?.quantity) + 1
                      );
                    }}
                    className="border px-1"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="m-auto">
                <button
                  onClick={() => {
                    removeCartItem(
                      elem?.cart_items_id,
                      elem?.product_variant_id
                    );
                  }}
                  className="flex justify-center items-center text-red-400"
                >
                  <TbTrash />
                </button>
              </div>
              <div className="text-center">
                <span>
                  {parseFloat(elem?.price * elem?.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col bg-gray-100 mx-6 p-6 rounded-xl mb-5">
        <div id="SubTotal" className="flex justify-between">
          <div className="flex">SubTotal:</div>
          <div className="flex">{parseFloat(subTotal).toFixed(2)}</div>
        </div>
        <div id="Delivery" className="flex justify-between">
          <div className="flex">Delivery:</div>
          <div className="flex">{parseFloat(deliveryCost).toFixed(2)}</div>
        </div>
        <div id="Discount" className="flex justify-between mb-5">
          <div className="flex">Discount:</div>
          <div className="flex">-{parseFloat(discount).toFixed(2)}</div>
        </div>
        {selectedCoupon ? (
          <div className="flex flex-col border rounded-md px-2.5 py-4">
            <p className="px-1 mb-2">Applied Discount Code</p>

            <div id="Discount-Holder" className="mb-2.5">
              {selectedCoupon && (
                <div className="flex justify-between items-center border rounded-md px-1.5 py-3 bg-gray-50">
                  <div>
                    <div className="flex items-center font-semibold mb-2">
                      <MdDiscount className="mr-3" />
                      <span>{selectedCoupon?.discount_code}</span>
                    </div>
                    <div className="ml-7">
                      {selectedCoupon?.discount_description}
                    </div>
                  </div>
                  <div>
                    <button onClick={() => removeDiscount(selectedCoupon?.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col border rounded-md px-2.5 py-4">
            <p className="px-1 mb-2">Apply Discount Code</p>
            <div className="relative">
              <input
                type="text"
                placeholder="Discount Code"
                value={discountCode ? discountCode : ""}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="px-3 py-3 w-full flex justify-center items-center bg-white rounded-md"
              ></input>
              <div className="absolute top-3 right-5">
                {discountCode && discountCode.length > 1 ? (
                  <button
                    onClick={() => handleDiscount(discountCode)}
                    className=""
                  >
                    Apply
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="disabled:cursor-not-allowed"
                  >
                    Apply
                  </button>
                )}
              </div>
            </div>
            <div className="border-b border-black my-2.5"></div>
            <div className="border rounded-md px-2 py-2">
              <p className="mb-2">Discounts</p>
              <div id="Discount-Holder" className="mb-2.5">
                {coupons &&
                  coupons.map((coupon) => (
                    <div
                      key={coupon?.id}
                      className="flex justify-between items-center border rounded-md px-1.5 py-3 mb-2"
                    >
                      <div>
                        <div className="flex items-center font-semibold mb-2">
                          <MdDiscount className="mr-3" />
                          <span>{coupon?.discount_code}</span>
                        </div>
                        <div className="ml-7">
                          {coupon?.discount_description}
                        </div>
                      </div>
                      <div>
                        <button
                          onClick={() => handleDiscount(coupon?.discount_code)}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
        <div id="separator" className="py-3"></div>
        <div id="Grand Total" className="flex justify-between font-bold">
          <div className="flex">Grand Total:</div>
          <div className="flex">
            {parseFloat(subTotal - discount).toFixed(2)}
          </div>
        </div>
        <div id="separator" className="p-2"></div>
        <div id="checkout" className="flex justify-end">
          <button
            className="p-3 bg-primary text-secondary rounded-lg"
            onClick={() => handleCheckout()}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
