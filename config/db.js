import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI).then(()=>console.log("DATABASE IS CONNECTED"))
}

export default connectDB