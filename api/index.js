import express from 'express';
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
mongoose.connect(process.env.MONGO).then(()=> {
    console.log("connected to mongodb");
}).catch((err)=>{
    console.log(err);
});
const app=express();
app.listen(3000,()=>{
    console.log("server has listening")
});

