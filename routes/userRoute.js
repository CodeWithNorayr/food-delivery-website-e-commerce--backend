import express from "express"
import { userRegister, userLogin } from "../controllers/userController.js"

const userRouter = express.Router()

// user register router

userRouter.post('/registration',userRegister)
userRouter.post('/login',userLogin)

export default userRouter




