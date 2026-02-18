import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./config/db.js";
import cloudinaryConnect from "./config/cloudinary.js";

import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express();

// ✅ Render assigns PORT via environment variable
const PORT = process.env.PORT || 4000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
connectDB();

// ✅ Connect to Cloudinary
cloudinaryConnect();

// ✅ Routes
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/allorder", orderRouter);

// ✅ Health check
app.get("/", (req, res) => {
  res.send("API is working");
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
