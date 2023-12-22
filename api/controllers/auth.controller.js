import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
export const signup= async (req,res,next)=>{
  const {email,username,password}=req.body; 
  const hashedPassword=bcryptjs.hashSync(password,10);
  const newUser=new User({username,password:hashedPassword,email});
  try {
    await newUser.save();
    res.status(201).json({
      statusCode:201,
       message:"user created successfully",
    });
  } catch (error) {
    console.log(error);
   next(error);
  }
 
}

export const signin= async (req,res,next)=>{
   const {email,password}=req.body;
   console.log(req.body);
   try {
    const validUser=await User.findOne({email});
    console.log(validUser);
    
    if(!validUser) return next(errorHandler(404,"User not found"));
    const validPassword=bcryptjs.compareSync(password,validUser.password);
    if(!validPassword) return next(errorHandler(401,"wrong credentials")); 
     const token=jwt.sign({id:validUser._id},process.env.JWT_SECRET);
     const valid={...validUser};
     delete valid._doc.password;
     res
     .cookie('access_token',token,{httpOnly:true})
     .status(200)
     .json(valid._doc);

  } catch (error) {
    console.log(error.message);
    next(error);
   }
            
}

export const google=async (req,res,next)=>{
try{
  const {user,email,photo}=req.body;
  console.log(req.body);
      const data=await User.findOne({email})
       if(data){
        const valid={...data};
        delete valid._doc.password;
       const jwttoken= jwt.sign({id:data._id,},process.env.JWT_SECRET);
       console.log(valid._doc);
       res.cookie('access_token',jwttoken,{httpOnly:true}).status(200).json(valid._doc);
       }
       else{
        const generatedpassword=Math.random().toString(36).slice(-8);
         const hashedPassword=bcryptjs.hashSync(generatedpassword,10);       
        const newuser=new User({username:user.split(" ").join("").toLowerCase()+Math.random().toString().slice(-4),email,avatar:photo,password:hashedPassword});
        await newuser.save();
        const token=jwt.sign({id:newuser._id},process.env.JWT_SECRET);
        const {password:pass,...rest}=newuser._doc;
        res.cookie("access_token",token,{httpOnly:true}).status(200).json(rest);
       }
      }catch(error){
        next(error);
      }
}