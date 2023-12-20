import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/errorHandler.js";
export const signup= async (req,res,next)=>{
  const {email,username,password}=req.body; 
  const hashedPassword=bcryptjs.hashSync(password,10);
  const newUser=new User({username,password:hashedPassword,email});
  try {
    await newUser.save();
    res.status(201).json({
       message:"user created successfully",
    });
  } catch (error) {
   next(errorHandler(500,"error from the function"));
  }
 
}