import { addFood,removeFood,foodList } from "../controllers/foodController.js";
import express from "express"
import upload from "../config/multer.js";

const foodRouter = express.Router()

foodRouter.post('/add',upload.single('image'),addFood)
foodRouter.get('/list',foodList)
foodRouter.delete('/remove',removeFood)

export default foodRouter