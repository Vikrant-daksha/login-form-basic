import { useCallback, useEffect, useState } from "react";
import { LuCheck } from "react-icons/lu";
import ProgressBar from "../components/ProgressBar";
import api from "../api/axiosinstance";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import Timer from "../components/Timer";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function Checkout() {
  const expiryTime = useCallback(() => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + 300);
    return time;
  }, []);

  const [time] = useState(expiryTime);

  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [searchParams] = useSearchParams();
  const [productData, setProductData] = useState(null);
  const [addressPopup, setAddressPopup] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("new");
  const [databaseAddress, setDatabaseAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const [orderId, setOrderId] = useState(null);

  const [recipient, setRecipient] = useState("");
  const [apt, setApt] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [stateName, setStateName] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  const fetchClientSecret = useCallback(async () => {
    try {
      if (productData) {
        const res = await api.post(
          `/api/auth/buy-now/${productData.product_id}`,
          {
            cart: productData,
          }
        );

        return res.data.clientSecret;
      } else {
        const res = await api.get("api/auth/create-checkout");

        return res.data.clientSecret;
      }
    } catch (err) {
      console.error("Error", err);
    }
    // Create a Checkout Session
  }, [productData]);

  const options = { fetchClientSecret };

  const clearAddress = () => {
    setRecipient("");
    setApt("");
    setAddress("");
    setArea("");
    setStateName("");
    setCity("");
    setPincode("");
    setMobileNumber("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !recipient ||
      !apt ||
      !address ||
      !stateName ||
      !city ||
      !pincode ||
      !mobileNumber
    ) {
      return alert("Fill Required Fields!");
    } else {
      const addressData = {
        name: recipient,
        apt: apt,
        exact_address: address,
        state_name: stateName,
        city: city,
        pincode: pincode,
        mobile: mobileNumber,
      };

      if (!addressData) {
        return alert("Could Not Submit Address");
      }

      let savedAddress;

      if (selectedAddressId !== "new") {
        const res = await api.get(`/api/auth/address/${selectedAddressId}`);
        savedAddress = res.data;
        console.log(res.data);
      } else {
        const res = await api.post("/api/auth/add-address", addressData);
        savedAddress = res.data;
        console.log(res.data);
      }

      const cartId = searchParams.get("cartId");

      if (savedAddress && (productData || cartId)) {
        const addressId = savedAddress.id;
        const res = await api.post("/api/auth/create-order", {
          address_id: addressId,
          cart_id: cartId,
          productData: productData,
          payment_method: paymentMethod,
        });
        localStorage.setItem("orderId", res.data.order_id);
        console.log(res.data.order_id);
      }

      handleNext();
    }
  };

  const handleAddress = async (address) => {
    if (!address) {
      return;
    }
    clearAddress();

    setSelectedAddressId(address.id);
    setRecipient(address.address_name || "");
    setAddress(address.address || "");
    setApt(address.apt || "");
    setArea(address.area || "");
    setMobileNumber(address.mobile_no || "");
    setPincode(address.pincode || "");
    setStateName(address.state_name || "");
    setCity(address.city || "");
  };

  useEffect(() => {
    const getUserAddress = async () => {
      const res = await api.get("/api/auth/get-user-address");
      if (!res) {
        return;
      }
      setDatabaseAddress(res.data);
      console.log(res.data);
    };

    getUserAddress();
  }, []);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) return;

    setStep(3);
    setPaymentStatus("processing");

    let isCancelled = false;

    const pollPayment = async () => {
      const maxRetries = 10; // stop after 10 attempts (50 seconds)
      let attempt = 0;

      while (attempt < maxRetries && !isCancelled) {
        try {
          const res = await api.get(`/api/auth/checkout/${sessionId}`);
          setTransaction(res.data);
          console.log(res.data);

          if (!isCancelled) {
            // Got a response — update status and stop polling
            if (res.data.payment_status === "paid") {
              setPaymentStatus("success");
            } else {
              if (res.data === 404) {
                console.error("Invalid Session Id");
              }
              setPaymentStatus("fail");
            }
          }
          return; // success, stop polling
        } catch (err) {
          console.error(`Attempt ${attempt + 1} failed:`, err);
          attempt++;

          if (attempt < maxRetries && !isCancelled) {
            // Wait 5 seconds before retrying
            await new Promise((resolve) => setTimeout(resolve, 10000));
          }
        }
      }

      // All retries exhausted
      if (!isCancelled) {
        setPaymentStatus("fail");
      }
    };

    pollPayment();

    // Cleanup if component unmounts mid-polling
    return () => {
      isCancelled = true;
    };
  }, [searchParams]);

  useEffect(() => {
    const buyNow = searchParams.get("productId");
    if (!buyNow) {
      return;
    }

    const getProduct = async () => {
      try {
        const res = await api.get(`/api/products/cart-item/${buyNow}`);
        console.log(res.data[0]);
        setProductData(res.data[0]);
      } catch (err) {
        console.error("Error Fecthing Products");
      }
    };

    getProduct();
  }, [searchParams]);

  useEffect(() => {
    const createTransaction = async () => {
      const orderId = localStorage.getItem("orderId");
      if (transaction && transaction !== 404) {
        const res = await api.post(`/api/auth/create-transaction/${orderId}`, {
          transaction,
        });
        setOrderId(res.data.orderStatus.id);
        console.log(res.data);
      }
    };

    createTransaction();
  }, [transaction]);

  useEffect(() => {
    console.log(selectedAddressId);
  }, [selectedAddressId]);

  useEffect(() => {
    console.log(orderId);
  }, [orderId]);

  useEffect(() => {
    console.log(transaction);
  }, [transaction]);

  useEffect(() => {
    if (paymentStatus === "success") {
      let id;
      if (!orderId) {
        id = localStorage.getItem("orderId");
      }
      const timer = setTimeout(() => {
        navigate(`/checkout/success/${orderId || id}`);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [paymentStatus, navigate]);

  // async function payWithStripe() {
  //   try {
  //     const res = await api.get("/api/auth/create-checkout");

  //     console.log("Resdata", res.data);

  //     window.location.href = res.data.url;
  //   } catch (err) {
  //     console.error("Error", err);
  //   }
  // }

  async function payWithCashfree() {
    try {
      //   let cashfree;
      //   var initializeSDK = async function () {
      //     cashfree = await load({
      //       mode: "production",
      //     });
      //   };
      //   const doPayment = async () => {
      //     cashfree = await initializeSDK();
      //     let checkoutOptions = {
      //       paymentSessionId: res.data,
      //       redirectTarget: "_self",
      //     };
      //     cashfree.checkout(checkoutOptions);
      //   };
      //   doPayment();
      // const cashfree = await load({
      //   mode: "sandbox",
      // });
      // console.log("Session:", res.data.payment_session_id);
      // cashfree.checkout({
      //   paymentSessionId: res.data.payment_session_id,
      //   redirectTarget: "_self",
      // });
      //   const initializeSDK = async () => {
      //     return await load({
      //       mode: "sandbox",
      //     });
      //   };
      //   const doPayment = async () => {
      //     const cashfree = await initializeSDK();
      //     let checkoutOptions = {
      //       paymentSessionId: JSON.stringify(res.data),
      //       redirectTarget: "_self",
      //     };
      //     cashfree.checkout(checkoutOptions);
      //   };
      //  doPayment();
    } catch (err) {
      console.error("Error", err);
    }
  }

  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const handlePrevious = () => {
    if (step > 1) setStep((step) => step - 1);
  };

  const handleNext = () => {
    if (step < 3) setStep((step) => step + 1);
  };

  return (
    <div className="m-5">
      {addressPopup && (
        <div className="flex justify-center items-center fixed top-0 left-0 w-full h-full z-50 backdrop-blur-[2px]">
          <div className="bg-white h-fit w-2xs border border-black rounded-lg px-2 pb-2">
            <div className="flex justify-between items-center px-3 py-1.5 border-b border-black mb-3">
              <div className="">Select Address</div>
              <button onClick={() => setAddressPopup(false)}>
                <IoMdClose />
              </button>
            </div>
            {databaseAddress.map((dba) => (
              <div
                key={dba.id}
                className="bg-white h-fit border border-black rounded-lg mb-3"
              >
                <button
                  className="w-full h-full text-sm"
                  onClick={() => {
                    setAddressPopup(false);
                    handleAddress(dba);
                  }}
                >
                  <div>{dba.address_name}</div>
                  <div className="truncate">{dba.address}</div>
                  <div>{dba.mobile_no}</div>
                  <div>{dba.pincode}</div>
                  <div>{dba.state_name}</div>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div>
        <h1 className="text-2xl">Checkout</h1>
      </div>
      <div className="mt-1.5 w-full">
        <div className="flex justify-end">
          <div
            className={
              step >= 1
                ? "flex justify-center items-center border border-black w-8 h-8 mx-1.5 rounded-full bg-black text-white "
                : "flex justify-center items-center border border-black w-8 h-8 mx-1.5 rounded-full"
            }
          >
            {step > 1 ? <LuCheck /> : "1"}
          </div>
          <div className="relative w-4">
            <div
              className={
                step > 1
                  ? "absolute mt-3.5 border-t-4 border-dotted border-black w-4"
                  : "absolute mt-3.5 border-t-4 border-dotted border-gray-300 w-4"
              }
            ></div>
          </div>
          <div
            className={
              step >= 2
                ? "flex justify-center items-center border border-black w-8 h-8 mx-1.5 rounded-full bg-black text-white "
                : "flex justify-center items-center border border-black w-8 h-8 mx-1.5 rounded-full"
            }
          >
            {step > 2 ? <LuCheck /> : "2"}
          </div>
          <div className="relative w-4">
            <div
              className={
                step > 2
                  ? "absolute mt-3.5 border-t-4 border-dotted border-black w-4"
                  : "absolute mt-3.5 border-t-4 border-dotted border-gray-300 w-4"
              }
            ></div>
          </div>
          <div
            className={
              step >= 3
                ? "flex justify-center items-center border border-black w-8 h-8 mx-1.5 rounded-full bg-black text-white "
                : "flex justify-center items-center border border-black w-8 h-8 mx-1.5 rounded-full"
            }
          >
            {paymentStatus === "success" ? <LuCheck /> : "3"}
          </div>
        </div>
      </div>
      <div className="my-3 border border-black rounded-lg p-5">
        <div className="w-full">
          {step === 1 && (
            <div id="header" className="text-lg font-semibold">
              <div className="flex justify-between items-center">
                <div className="text-lg font-semibold">
                  Add Shipping Details
                </div>
                {databaseAddress?.length !== 0 && (
                  <button
                    onClick={() => setAddressPopup(true)}
                    className="text-sm border border-black px-2 py-1 rounded-lg mb-2"
                  >
                    Saved Address
                  </button>
                )}
              </div>
              <div className="border-t border-gray-300 mt-0.5 mb-3"></div>
              <div className="w-1/2 font-light mx-40 py-2">
                <div className="overflow-hidden m-auto">
                  <form onSubmit={handleSubmit}>
                    <div className="flex flex-col w-1/2 mb-3">
                      <label className="mb-1">Recipient Name*</label>
                      <input
                        type="text"
                        className="border border-gray-300 p-2 pl-3 rounded-lg"
                        onChange={(e) => {
                          setRecipient(e.target.value);
                        }}
                        placeholder="First Name"
                        value={recipient}
                        maxLength={50}
                      ></input>
                    </div>
                    <div className="text-lg mb-1.5">Shipping Address</div>
                    <div className="flex flex-col w-1/2 mb-3">
                      <label className="mb-1">
                        Flat No. / Apt Name / House No.
                      </label>
                      <input
                        type="text"
                        className="border border-gray-300 p-2 pl-3 rounded-lg"
                        onChange={(e) => {
                          setApt(e.target.value);
                        }}
                        placeholder="Flat No / Apartment / House"
                        value={apt}
                        required
                        maxLength={50}
                      ></input>
                    </div>
                    <div className="flex flex-col w-1/2 mb-3">
                      <label className="mb-1">Address</label>
                      <textarea
                        type="text"
                        className="border border-gray-300 p-2 pl-3 rounded-lg max-h-40"
                        onChange={(e) => {
                          setAddress(e.target.value);
                        }}
                        placeholder="Address"
                        rows={4}
                        value={address}
                        required
                        maxLength={400}
                      ></textarea>
                    </div>
                    <div className="flex flex-col w-1/2 mb-3">
                      <label className="mb-1">
                        Locality / Area{" "}
                        <span className="font-[100]"> (optional)</span>
                      </label>
                      <input
                        type="text"
                        className="border border-gray-300 p-2 pl-3 rounded-lg"
                        onChange={(e) => {
                          setArea(e.target.value);
                        }}
                        placeholder="locality / area"
                        value={area}
                        maxLength={100}
                      ></input>
                    </div>
                    <div className="w-1/2 grid grid-cols-3 gap-3">
                      <div className="flex flex-col w-full">
                        <label className="mb-1">State</label>
                        <input
                          type="text"
                          className="border border-gray-300 p-2 pl-3 rounded-lg"
                          onChange={(e) => {
                            setStateName(e.target.value);
                          }}
                          placeholder="State"
                          value={stateName}
                          required
                          maxLength={100}
                        ></input>
                      </div>
                      <div className="flex flex-col w-full">
                        <label className="mb-1">City</label>
                        <input
                          type="text"
                          className="border border-gray-300 p-2 pl-3 rounded-lg"
                          onChange={(e) => {
                            setCity(e.target.value);
                          }}
                          placeholder="City"
                          value={city}
                          required
                          maxLength={100}
                        ></input>
                      </div>
                      <div className="flex flex-col w-full">
                        <label className="mb-1">Pincode</label>
                        <input
                          type="text"
                          className="border border-gray-300 p-2 pl-3 rounded-lg"
                          onChange={(e) => {
                            setPincode(e.target.value);
                          }}
                          placeholder="Pincode"
                          value={pincode}
                          required
                          maxLength={50}
                        ></input>
                      </div>
                    </div>
                    <div className="flex flex-col w-1/2 my-3">
                      <label className="mb-1">Mobile Number</label>
                      <input
                        type="text"
                        className="border border-gray-300 p-2 pl-3 rounded-lg"
                        onChange={(e) => {
                          setMobileNumber(e.target.value);
                        }}
                        placeholder="Contact No"
                        value={mobileNumber}
                        required
                        maxLength={50}
                      ></input>
                    </div>
                    <div className="w-1/2 mb-10">
                      <div className="text-lg mb-2">Payment Options</div>
                      <button
                        type="submit"
                        onClick={() => setPaymentMethod("stripe")}
                        className="w-full border border-black rounded-lg py-1"
                      >
                        Pay with Stripe
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div id="header" className="text-lg font-semibold">
              Stripe Payment
              <div className="border-t border-gray-300 mt-0.5 mb-3"></div>
              <div id="checkout" className="w-full">
                <EmbeddedCheckoutProvider
                  stripe={stripePromise}
                  options={options}
                >
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
              </div>
              <div className="w-full flex justify-center mt-5">
                <button
                  onClick={handlePrevious}
                  className="w-1/2 uppercase border py-2 border-black text-sm rounded-lg cursor-pointer hover:bg-black hover:text-white transition-all"
                >
                  GO Back
                </button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div id="header" className="text-lg font-semibold">
              Processing Payment
              <div className="border-t border-gray-300 mt-0.5 mb-3"></div>
              <div className="w-full h-[50vh] flex justify-center items-center">
                <div className="flex flex-col justify-center items-center">
                  <div
                    id="Timer"
                    className="h-40 w-40 flex justify-center items-center rounded-full border border-black mb-2"
                  >
                    {paymentStatus === "success" ? (
                      "success"
                    ) : (
                      <Timer
                        expiryTimestamp={time}
                        size={"1.5rem"}
                        shouldPause={paymentStatus === "fail"}
                        onExpire={() => setPaymentStatus("fail")}
                      />
                    )}
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <div className="text-xs text-gray-400 mb-1">
                      {paymentStatus === "success"
                        ? ""
                        : "Processing Payment..."}
                    </div>
                    <div className="text-sm text-gray-600">
                      {paymentStatus === "success"
                        ? "Payment Confirmed."
                        : "Do Not Close This Window."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Checkout;
