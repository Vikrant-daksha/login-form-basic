import Stripe from "stripe";
//import { cart } from "../controllers/authControllers";

const stripe = new Stripe(process.env.SECRET_KEY);

export default stripe;

export const createCheckoutSession = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Test Product",
            },
            unit_amount: 100 * 100, // ₹100 in paise
          },
          quantity: 1,
        },
      ],
      ui_mode: "embedded",
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Stripe session failed" });
  }
};

// const createSession = async (req, res) => {
//   const session = await stripe.checkout.sessions.create({
//     ui_mode: "embedded",
//     line_items: [
//       {
//         // Provide the exact Price ID (for example, price_1234) of the product you want to sell
//         price: "1000",
//         quantity: 1,
//       },
//     ],
//     mode: "payment",
//     return_url: `${YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
//   });

//   res.send({ clientSecret: session.client_secret });
// };

// export default createSession;

// app.get("/session-status", async (req, res) => {
//   const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

//   res.send({
//     status: session.status,
//     customer_email: session.customer_details.email,
//   });
// });
