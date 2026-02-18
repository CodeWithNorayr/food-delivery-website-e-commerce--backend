import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_TOKEN, { expiresIn: "7d" });
};

// user registration controller
export const userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if user exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // validate email
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Email is not valid" });
    }

    // validate password strength
    if (!password || password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    // generate token
    const token = generateToken(user._id);

    // send response with token
    res.json({
      success: true,
      message: "User registered successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
};


// user login controller

export const userLogin = async (req,res) => {
  try {
    const {email,password} = req.body;
    
    const user = await userModel.findOne({email})

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    if(!user){
     return res.json({success:false,message:'The user is not registered'})
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
      return res.json({success:false,message:"The password is not matched"})
    }

    const token = generateToken(user._id)

    res.json({
        success:true,
        message:'User is logged in successfully',
        token,
        user: { id: user._id, name: user.name, email: user.email }
      })

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Login failed" });
  }
};

