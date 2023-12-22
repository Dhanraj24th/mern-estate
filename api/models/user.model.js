import mongoose from "mongoose";

const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    }
    ,
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        default:"https://images.rawpixel.com/image_social_square/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcGYtaWNvbjQtamlyMjA2Mi1wb3ItMDMtbC5qcGc.jpg?s=BgHm8LFR1h8PQ6WXa-8WMpNOqXIS3LjLN9wecxMV7qE"
    }
}, {timestamps:true})
const User=mongoose.model("User",userSchema);
export default User;