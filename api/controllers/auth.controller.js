import User from "../models/user.model.js";
export const signup= async (req,res)=>{
  const {email,username,password}=req.body; 
  const newUser=new User({username,password,email});
  await newUser.save();
     res.status(201).json({
        message:"user created successfully",
     });
}