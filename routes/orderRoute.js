import express from "express"
import  { placeOrder,userOrders,verifyOrder,fetchAllOrders } from "../controllers/orderController.js"
import authMiddleware from "../middleware/authMiddleware.js"

const orderRouter = express.Router()

orderRouter.post('/place',authMiddleware,placeOrder)
orderRouter.post('/verify',verifyOrder)
orderRouter.post('/userorders',userOrders)
orderRouter.get('/allorders',fetchAllOrders)

export default orderRouter
