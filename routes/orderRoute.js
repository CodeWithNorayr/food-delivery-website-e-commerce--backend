import express from "express";
import {
  placeOrder,
  userOrders,
  verifyOrder,
  fetchAllOrders,
  stripeWebhook
} from "../controllers/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import bodyParser from "body-parser";

const orderRouter = express.Router();

// ==========================
// Routes with auth
// ==========================
orderRouter.post('/place', authMiddleware, placeOrder);
orderRouter.post('/userorders', authMiddleware, userOrders);
orderRouter.get('/allorders', authMiddleware, fetchAllOrders); // only admin

// ==========================
// Payment verification
// ==========================
orderRouter.post('/verify', verifyOrder);

// ==========================
// Stripe webhook route (raw body required)
// ==========================
orderRouter.post(
  '/webhook',
  bodyParser.raw({ type: 'application/json' }), // raw body required by Stripe
  stripeWebhook
);

export default orderRouter;
