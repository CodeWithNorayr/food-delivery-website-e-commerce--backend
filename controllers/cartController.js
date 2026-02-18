import userModel from "../models/userModel.js";

const addToCart = async (req,res) => {
  try {
    const userData = await userModel.findById(req.body.userId)
    const cartData = userData.cartData
    if(!cartData[req.body.itemId]){
      cartData[req.body.itemId] = 1
    } else {
      cartData[req.body.itemId] += 1
    }
    await userModel.findByIdAndUpdate(req.body.userId,{cartData})
    res.json({success:true,message:"Food is added to Cart"})
  } catch (error) {
    console.log(error)
    res.json({success:false,message:"Unable to add"})
  }
}

const removeFromCart = async (req,res) => {
  try {
    const userData = await userModel.findById(req.body.userId)
    const cartData = userData.cartData
    if(cartData[req.body.itemId]>0){
      cartData[req.body.itemId] -= 1
    }
    await userModel.findByIdAndUpdate(req.body.userId,{cartData})
    res.json({success:true,message:"Food is removed from the cart"})
  } catch (error) {
    console.log(error)
    res.json({success:false,message:"Unable to remove"})
  }
}

const getCartItems = async (req,res) => {
  try {
    const userData = await userModel.findById(req.body.userId)
    const cartData = userData.cartData
    res.json({success:true,data:cartData})
  } catch (error) {
    console.log(error)
    res.json({success:false,message:"Unable to fetch food from the cart"})
  }
}

export {addToCart,removeFromCart,getCartItems}