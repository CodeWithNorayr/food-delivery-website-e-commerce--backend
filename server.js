import express from "express";
import cors from "cors";
import "dotenv/config";
import bodyParser from "body-parser";

import connectDB from "./config/db.js";
import cloudinaryConnect from "./config/cloudinary.js";

import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express();

// ===================================
// PORT
// ===================================
const PORT = process.env.PORT || 4000;

// ===================================
// CORS
// ===================================
app.use(cors());

// Handle preflight requests
app.options("*", cors());

// ===================================
// STRIPE WEBHOOK
// ===================================
app.use(
  "/api/order/webhook",
  bodyParser.raw({ type: "application/json" })
);

// ===================================
// JSON PARSER
// ===================================
app.use(express.json());

// ===================================
// ROUTES
// ===================================
app.get("/", (req, res) => {
  res.send("API is working");
});

app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/allorder", orderRouter);

// ===================================
// START SERVER
// ===================================
const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB Connected");

    await cloudinaryConnect();
    console.log("Cloudinary Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.log("Server startup error:", error);
  }
};

startServer();
