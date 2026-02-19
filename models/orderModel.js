import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
  userId:{type:String,required:true},
  address:{type:Object,required:true},
  items:{type:Array,required:true},
  amount:{type:Number,required:true},
  payment:{type:Boolean,default:false}
})

const orderModel = mongoose.models.order || mongoose.model('order',orderSchema)

export default orderModel
