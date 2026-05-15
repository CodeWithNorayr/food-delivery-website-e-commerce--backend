import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DATABASE IS CONNECTED");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error; // important so Render can catch it
  }
};

export default connectDB;
