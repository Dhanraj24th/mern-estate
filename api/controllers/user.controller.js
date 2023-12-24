import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';

import { errorHandler } from "../utils/errorHandler.js";

export const test=(req,res)=>{
    res.json({
        message:"hello world",
    });
}
export const deleteUser=async (req,res,next)=>{
   console.log(req.user,req.params,req.body);
   if(req.params.id!=req.user.id) return next(errorHandler(401,"you can delete your own account"));
   try {
      const deleteUser= await User.findByIdAndDelete(req.param.id);
      res.status(200).json({message:"User has been deleted",data:deleteUser});
   } catch (error) {
      next(errorHandler(500,error.message));
   }
}
export const updateUser= async (req,res,next)=>{
    console.log(req.user ,req.params,req.body);
  if( req.params.id!=req.user.id) return next(errorHandler(401,"you can update your own account"));
  try{
     if(req.body.password){
        req.body.password=bcryptjs.hashSync(req.body.password,10);
     }
     const updatedUser = await User.findByIdAndUpdate(req.params.id,{
        $set:{username:req.body.username,
        email:req.body.email,
        password:req.body.password,
        avatar:req.body.avatar,
        }
     },{new :true})
     const {password,...rest}=updatedUser._doc;
     res.status(200).json(rest);
  } catch(error){
       console.log(error.message);
       next(errorHandler(500,"internal server error ..."))
  }   

}