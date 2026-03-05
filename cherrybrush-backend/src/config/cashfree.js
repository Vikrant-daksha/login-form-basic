import { Cashfree, CFEnvironment } from "cashfree-pg";

// async function cashfreeOrder(req, res) {
//   const cashFree = new Cashfree(
//     CFEnvironment.SANDBOX,
//     process.env.CASHFREE_APP_ID,
//     process.env.CASHFREE_SECRET_KEY
//   );

//   console.log("Base URL:", cashFree.PGOrderBasePath());

//   // import { load } from "@cashfreepayments/cashfree-js";

//   // function Checkout() {
//   //   let cashfree;
//   //   var initializeSDK = async function () {
//   //     cashfree = await load({
//   //       mode: "production",
//   //     });
//   //   };
//   //   initializeSDK();

//   //   const doPayment = async () => {
//   //     let checkoutOptions = {
//   //       paymentSessionId: "your-payment-session-id",
//   //       redirectTarget: "_self",
//   //     };
//   //     cashfree.checkout(checkoutOptions);
//   //   };

//   //   return (
//   //     <div class="row">
//   //       <p>Click below to open the checkout page in the current tab</p>
//   //       <button type="submit" class="btn btn-primary" id="renderBtn" onClick={doPayment}>
//   //         Pay Now
//   //       </button>
//   //     </div>
//   //   );
//   // }
//   // export default Checkout;

//   var request = {
//     order_amount: 1.0,
//     order_currency: "INR",
//     order_id: "devstudio_" + Math.random() * 100000,
//     customer_details: {
//       customer_id: "devstudio_user",
//       customer_phone: "9876543210",
//       customer_name: "Harshith",
//       customer_email: "test@cashfree.com",
//     },
//     order_meta: {
//       return_url: "http://localhost:5173/payment-success?order_id={order_id}",
//       payment_methods: "cc,dc,upi",
//     },
//     cart_details: {
//       cart_items: [
//         {
//           item_id: "devstudio_cart_id",
//           item_name: "Shoes",
//           item_description:
//             "Durable, comfortable, and perfect for adding personality to any outfit.",
//           item_image_url:
//             "https://cashfreelogo.cashfree.com/website/landings-cache/landings/occ/brownShoe.png",
//           item_original_unit_price: 1.0,
//           item_discounted_unit_price: 1.0,
//           item_quantity: 1,
//           item_currency: "INR",
//         },
//       ],
//     },
//   };

//   cashFree
//     .PGCreateOrder(request)
//     .then((response) => {
//       const passId = response.data.payment_session_id;
//       res.json(passId);
//       console.log(
//         "Order created successfully:",
//         response.data.payment_session_id
//       );
//     })
//     .catch((error) => {
//       console.error("Error:", error.response.data.message);
//     });

//   //   const sessionId = async (req, res) => {
//   //     try {
//   //       const id = passId;
//   //       res.send(id);
//   //     } catch (err) {
//   //       console.error("Error", err);
//   //     }
//   //   };

//   //   sessionId();
// }

// export default cashfreeOrder;

Cashfree.XClientId = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
Cashfree.XEnvironment = CFEnvironment.SANDBOX;

async function cashfreeOrder(req, res) {
  try {
    const cashfree = new Cashfree(
      CFEnvironment.SANDBOX,
      process.env.CASHFREE_APP_ID,
      process.env.CASHFREE_SECRET_KEY
    );

    const request = {
      order_id: "order_" + Date.now(),
      order_amount: 1,
      order_currency: "INR",
      customer_details: {
        customer_id: "devstudio_user",
        customer_name: "Harshith",
        customer_email: "test@cashfree.com",
        customer_phone: "9876543210",
      },
      order_meta: {
        return_url: "http://localhost:5173/payment-success?order_id={order_id}",
      },
    };

    const response = await cashfree.PGCreateOrder(request);

    console.log("Created Order:", response.data);

    res.json({
      payment_session_id: response.data.payment_session_id,
    });
  } catch (err) {
    console.error("CF ERROR:", err.response?.data || err);
    res.status(500).json({ error: "Order creation failed" });
  }
}

export default cashfreeOrder;
