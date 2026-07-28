import express from "express";
import cors from "cors";
import "dotenv/config.js";
import clientRoutes from "./routes/clientRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { env } from "./config/env.js";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? 100 : 10000, // Developer-friendly limits in dev
  message: "Too many requests from this IP, please try again after 15 minutes",
});

const app = express();

// app.use(
//   cors({
//     origin: "https://cherrybrush.vercel.app",
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(limiter);

app.use("/api", clientRoutes);
app.use("/api/auth", authRoutes);

//Custom Global Error Handler
// app.use((err, req, res, next) => {
//   console.error(err.stack);

//   res.status(err.statusCode || 500).json({
//     success: false,
//     message: err.message || "Internal Server Error",
//     stack: process.env.NODE_ENV === "development" ? err.stack : {},
//   });
// });

const PORT = env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
