import express from 'express';
import dotenv from "dotenv";
dotenv.config();
import userRouter from "./routes/user.route.js"
import mongoose from "mongoose";
import authRouter from "./routes/auth.route.js"
mongoose.connect("mongodb+srv://dhanraj24:dhanraj24@mern-estate.mlsma5s.mongodb.net/?retryWrites=true&w=majority").then(()=> {
    console.log("connected to mongodb");
}).catch((err)=>{
    console.log(err);
});
const app=express();
app.use(express.json());
app.listen(3000,()=>{
    console.log("server has listening")
});
app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);
app.use((err,req,res,next)=>{
    const statusCode=err.statusCode||500;
    const message =err.message ||"Internal Server Error";
   // console.log(err);
    return res.status(statusCode).json({
        success : false,
        statusCode,
        message
    })
})
