import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
export const signup= async (req,res)=>{
  const {email,username,password}=req.body; 
  const hashedPassword=bcryptjs.hashSync(password,10);
  const newUser=new User({username,password:hashedPassword,email});
  await newUser.save();
     res.status(201).json({
        message:"user created successfully",
     });
}