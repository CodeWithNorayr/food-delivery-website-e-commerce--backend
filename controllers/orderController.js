import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

 export const placeOrder = async (req,res) => {

  const frontend_url = 'https://food-delivery-website-e-commerce-ahxw.onrender.com'

  try {
   const newOrder = new orderModel({
    userId:req.body.userId,
    items:req.body.items,
    address:req.body.address,
    amount:req.body.amount
   })
   await newOrder.save()
   await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}})

   const line_items = req.body.items.map((item)=>({
      price_data:{
        currency:'inr',
        product_data:{
          name:item.name
        },
        unit_amount:item.price*100
      },
      quantity:item.quantity
   }))

   line_items.push({
    price_data:{
      currency:"inr",
      product_data:{
        name:"Delivery Charges"
      },
      unit_amount:2*100*80
    },
    quantity:1
   })

   const session = await stripe.checkout.sessions.create({
    line_items:line_items,
    mode:"payment",
    success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
    cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`
   })

   res.json({success:true,session_url:session.url})

  } catch (error) {
    console.log(error)
    res.json({success:false,message:"Error"})
  }
}

 export const verifyOrder = async (req,res) => {
  const {success,orderId} = req.body
  try {
    if(success=="true"){
      await orderModel.findByIdAndUpdate(orderId,{payment:true})
      res.json({success:true,message:"Paid"})
    } else {
      await orderModel.findByIdAndDelete(orderId)
      res.json({success:false,message:"Not paid"})
    }
  } catch (error) {
    console.log(error)
    res.json({success:false,message:"Error"})
  }
}

export const userOrders = async (req, res) => {
  try {
    // ✅ Safe userId extraction
    const userId = req.user?.id || req.body.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authorized",
      });
    }

    // ✅ Fetch orders for this user
    const orders = await orderModel.find({ userId });

    res.status(200).json({
      success: true,
      data: orders,
    });

  } catch (error) {
    console.log("User Orders Error:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching orders",
    });
  }
};


export const fetchAllOrders = async (req,res) => {
  try {
    const allOrders = await orderModel.find({})
    res.json({success:true,data:allOrders})
  } catch (error) {
    console.log(error)
    res.json({success:false,message:"Error"})
  }
}


