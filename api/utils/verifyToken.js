import  jwt  from "jsonwebtoken";
import { errorHandler } from "./errorHandler.js";
export const verifyToken=(req,res,next)=>{
    console.log(req.cookies);
    const token=req.cookies.access_token;
       jwt.verify(token,"NCH49834RN93GG",(err,user)=>{
        if(err)return next(errorHandler(403,'Forbidden'));
        req.user=user;
        next();
       });

};