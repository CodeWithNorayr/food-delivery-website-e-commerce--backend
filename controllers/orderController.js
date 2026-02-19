import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ==========================
// Place a new order
// ==========================
export const placeOrder = async (req, res) => {
  const frontend_url = 'https://food-delivery-website-e-commerce-ekik.onrender.com';

  try {
    // ✅ Use userId from authMiddleware, not client input
    const userId = req.user.id;

    const newOrder = new orderModel({
      userId,
      items: req.body.items,
      address: req.body.address,
      amount: req.body.amount,
      payment: false, // mark unpaid initially
    });

    await newOrder.save();

    // ✅ Clear user's cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // ✅ Prepare Stripe line items
    const line_items = req.body.items.map(item => ({
      price_data: {
        currency: 'inr',
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    // Add delivery charges
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: 2 * 100,
      },
      quantity: 1,
    });

    // ✅ Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
      payment_intent_data: {
        metadata: { orderId: newOrder._id.toString() },
      },
    });

    res.json({ success: true, session_url: session.url });

  } catch (error) {
    console.error("Place Order Error:", error);
    res.status(500).json({ success: false, message: "Error placing order" });
  }
};

// ==========================
// Verify payment via query params (backup)
// ==========================
export const verifyOrder = async (req, res) => {
  const success = req.query.success || req.body.success;
  const orderId = req.query.orderId || req.body.orderId;

  try {
    if (!orderId) {
      return res.status(400).json({ success: false, message: "Missing orderId" });
    }

    if (success && success.toString() === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      return res.json({ success: true, message: "Payment successful" });
    } else {
      // Only delete if order exists
      const order = await orderModel.findById(orderId);
      if (order) await orderModel.findByIdAndDelete(orderId);
      return res.json({ success: false, message: "Payment not completed" });
    }
  } catch (error) {
    console.error("Verify Order Error:", error);
    res.status(500).json({ success: false, message: "Error verifying payment" });
  }
};

// ==========================
// Stripe webhook for production (reliable verification)
// ==========================
export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Use raw body for webhooks
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ Handle successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.payment_intent ? session.metadata?.orderId : null;

    if (orderId) {
      try {
        await orderModel.findByIdAndUpdate(orderId, { payment: true });
        console.log(`Order ${orderId} marked as paid via webhook`);
      } catch (err) {
        console.error("Error updating order payment via webhook:", err);
      }
    }
  }

  res.json({ received: true });
};

// ==========================
// Get orders of logged-in user
// ==========================
export const userOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await orderModel.find({ userId });

    res.status(200).json({ success: true, data: orders });

  } catch (error) {
    console.error("User Orders Error:", error);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

// ==========================
// Get all orders (Admin only)
// ==========================
export const fetchAllOrders = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const allOrders = await orderModel.find({});
    res.json({ success: true, data: allOrders });

  } catch (error) {
    console.error("Fetch All Orders Error:", error);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};
