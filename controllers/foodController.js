import foodModel from "../models/foodModel.js";
import { v2 as cloudinary } from "cloudinary";

// ✅ Add Food Controller
const addFood = async (req, res) => {
  try {
    let imageUpload = null;

    // ✅ Upload image to Cloudinary if file exists
    if (req.file) {
      imageUpload = await cloudinary.uploader.upload(req.file.path, {
        folder: "foods/images",
      });
    }

    // ✅ Create new food item
    const newFood = new foodModel({
      name: req.body.name,
      image: imageUpload ? imageUpload.secure_url : null,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
    });

    const food = await newFood.save();

    res.json({
      success: true,
      message: "Food added successfully",
      food,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Food was not added",
    });
  }
};

// ✅ Get Food List Controller
const foodList = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({
      success: true,
      data: foods,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Foods are not fetched",
    });
  }
};

// ✅ Remove Food Controller
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);

    if (!food) {
      return res.json({
        success: false,
        message: "Food not found",
      });
    }

    // ✅ Delete image from Cloudinary
    if (food.image) {
      const publicId = food.image.split("/").pop().split(".")[0];

      await cloudinary.uploader.destroy(`foods/images/${publicId}`);
    }

    // ✅ Delete food from MongoDB
    await foodModel.findByIdAndDelete(req.body.id);

    res.json({
      success: true,
      message: "Food deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error in deletion",
    });
  }
};

export { addFood, foodList, removeFood };
