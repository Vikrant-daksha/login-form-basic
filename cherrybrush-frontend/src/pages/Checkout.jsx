import { useCallback, useEffect, useState } from "react";
import ProgressBar from "../components/ProgressBar";
import api from "../api/axiosinstance";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useNavigate, useSearchParams } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function Checkout() {
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [searchParams] = useSearchParams();
  const [productData, setProductData] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const fetchClientSecret = useCallback(async () => {
    try {
      if (productData) {
        let res;
        if (!selectedVariant) {
          res = await api.post(`/api/auth/buy-now/${productData.product_id}`, {
            cart: productData,
          });
        } else if (productData && selectedVariant) {
          res = await api.post(`/api/auth/buy-now/${productData.product_id}`, {
            cart: productData,
            variant: selectedVariant[0],
          });
        }

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
    const variantId = searchParams.get("variantId");
    if (!buyNow) {
      return;
    }

    console.log(variantId);

    const getProduct = async () => {
      try {
        const res = await api.get(`/api/products/${buyNow}`);
        setProductData(res.data.product);
        const findVariant = res.data.variant;
        setSelectedVariant(
          findVariant
            .map((fv) => {
              if (fv.id === Number(variantId)) {
                return fv;
              }
            })
            .filter((fv) => fv !== undefined)
        );
      } catch (err) {
        console.error("Error Fecthing Products");
      }
    };

    getProduct();
  }, [searchParams]);

  useEffect(() => {
    console.log(productData);
  }, [productData]);

  useEffect(() => {
    console.log(paymentStatus);
  }, [paymentStatus]);

  useEffect(() => {
    if (paymentStatus === "success") {
      const timer = setTimeout(() => {
        navigate("/checkout/success");
      }, 3000); // show success for 3 seconds, then redirect
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

  const currentStep = () => {
    switch (step) {
      case 1:
        return "Step 1";
      case 2:
        return "Step 2";
      case 3:
        return "Step 3";
      default:
        return null;
    }
  };

  return (
    <div className="m-5">
      <div>
        <h1 className="text-2xl">Checkout</h1>
      </div>
      <div className="mt-1.5 w-full">
        <div className="flex justify-end">
          <div className="flex justify-center items-center border border-black w-6 h-6 mx-1.5 rounded-full">
            1
          </div>
          <div className="relative w-3">
            <div className="absolute mt-2.5 border-t-4 border-dotted border-gray-300 w-3"></div>
          </div>
          <div className="flex justify-center items-center border border-gray-300 text-gray-300 w-6 h-6 mx-1.5 rounded-full">
            2
          </div>
          <div className="relative w-3">
            <div className="absolute mt-2.5 border-t-4 border-dotted border-black w-3"></div>
          </div>
          <div className="flex justify-center items-center border border-black w-6 h-6 mx-1.5 rounded-full">
            3
          </div>
        </div>
        <ProgressBar totalSteps={totalSteps} steps={step} />
      </div>
      <div className="my-3 border border-black rounded-lg p-5">
        <div className="w-full">
          {step === 1 && (
            <div id="header" className="text-lg font-semibold">
              Add Shipping Details
              <div className="border-t border-gray-300 mt-0.5 mb-3"></div>
              <div className="w-1/2">
                <div className="overflow-hidden m-auto">
                  <div className="flex relative w-full">
                    <div className="flex flex-col w-1/4">
                      <label className="mb-1">First Name*</label>
                      <input
                        type="text"
                        className="border border-gray-300 p-2 pl-3 rounded-lg"
                        // onChange={(e) => {
                        //   setUsername(e.target.value);
                        // }}
                        placeholder="First Name"
                        //value={username}
                      ></input>
                    </div>
                    <div className="flex flex-col w-1/4 ml-3">
                      <label className="mb-1">Last Name</label>
                      <input
                        type="text"
                        className="border border-gray-300 p-2 pl-3 rounded-lg"
                        // onChange={(e) => {
                        //   setUsername(e.target.value);
                        // }}
                        placeholder="Last Name"
                        //value={username}
                      ></input>
                    </div>
                  </div>
                  <div className="flex flex-col w-1/2 mt-1">
                    <label className="mb-1">Contact No</label>
                    <input
                      type="text"
                      className="border border-gray-300 p-2 pl-3 rounded-lg"
                      // onChange={(e) => {
                      //   setUsername(e.target.value);
                      // }}
                      placeholder="Contact No"
                      //value={username}
                    ></input>
                  </div>
                  <div className="w-full mt-5 mb-5">
                    <div className="text-lg mb-1.5">Shipping Address</div>
                    <div className="flex w-full mb-1">
                      <div className="flex flex-col w-1/6 mr-2.5">
                        <label className="mb-1">Flat No</label>
                        <input
                          type="text"
                          className="border border-gray-300 p-2 pl-3 rounded-lg"
                          // onChange={(e) => {
                          //   setUsername(e.target.value);
                          // }}
                          placeholder="Flat No"
                          //value={username}
                        ></input>
                      </div>
                      <div className="flex flex-col w-1/3">
                        <label className="mb-1">
                          Apartment Name / House No
                        </label>
                        <input
                          type="text"
                          className="border border-gray-300 p-2 pl-3 rounded-lg"
                          // onChange={(e) => {
                          //   setUsername(e.target.value);
                          // }}
                          placeholder="Apartment / House"
                          //value={username}
                        ></input>
                      </div>
                    </div>
                    <div className="w-full mb-1">
                      <div className="flex flex-col w-1/2">
                        <label className="mb-1">Address</label>
                        <input
                          type="text"
                          className="border border-gray-300 p-2 pl-3 rounded-lg"
                          // onChange={(e) => {
                          //   setUsername(e.target.value);
                          // }}
                          placeholder="Address"
                          //value={username}
                        ></input>
                      </div>
                    </div>
                    <div className="flex w-full">
                      <div className="flex flex-col w-1/6">
                        <label className="mb-1">State</label>
                        <input
                          type="text"
                          className="border border-gray-300 p-2 pl-3 rounded-lg"
                          // onChange={(e) => {
                          //   setUsername(e.target.value);
                          // }}
                          placeholder="State"
                          //value={username}
                        ></input>
                      </div>
                      <div className="flex flex-col w-1/6 mx-2.5">
                        <label className="mb-1">City</label>
                        <input
                          type="text"
                          className="border border-gray-300 p-2 pl-3 rounded-lg"
                          // onChange={(e) => {
                          //   setUsername(e.target.value);
                          // }}
                          placeholder="City"
                          //value={username}
                        ></input>
                      </div>
                      <div className="flex flex-col w-1/6">
                        <label className="mb-1">Pincode</label>
                        <input
                          type="text"
                          className="border border-gray-300 p-2 pl-3 rounded-lg"
                          // onChange={(e) => {
                          //   setUsername(e.target.value);
                          // }}
                          placeholder="Pincode"
                          //value={username}
                        ></input>
                      </div>
                    </div>
                  </div>
                  <div className="w-1/2 mb-10">
                    <div className="text-lg mb-2">Payment Options</div>
                    <button
                      onClick={handleNext}
                      className="w-full border border-black rounded-lg py-1"
                    >
                      Pay with Stripe
                    </button>
                  </div>
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
                    {paymentStatus || "00:00"}
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <div className="text-xs text-gray-400 mb-1">
                      Processing Payment...
                    </div>
                    <div className="text-sm text-gray-600">
                      Do Not Close This Window.
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
