import Listing from "../models/Listing.model.js"
import { errorHandler } from "../utils/errorHandler.js";

export const createList=async (req,res,next)=>{
    if(req.body.userRef!=req.user.id) return next(errorHandler(401,"user can fetch his own listing"));
           try {
            const listing=await Listing.create(req.body);
            return res.status(201).json(listing);
           } catch (error) {
            next(error);
           }
}

export const getListing=async (req,res,next)=>{
            if(req.params.id!=req.user.id) return next(errorHandler(401,"user can fetch his own listing"));
            try {
                const listing=await Listing.find({userRef:req.params.id});
                if(listing.length==0) return next(errorHandler(404,"user not found"));
                return res.status(200).json(listing);
            } catch (error) { 
                next(error);
            }
}

export const deleteList=async(req,res,next)=>{
    console.log(req.body,req.user,req.params);
    console.log(req.body.userid!=req.user.id);
    if(req.body.userid!=req.user.id){
        return next(errorHandler(401,"user can delete his own listing"))
           }
    const listing=await Listing.findById(req.params.id);
           if(!listing){
            return next(errorHandler(404,'Listing not found'));
           }
           if(req.user.id!= listing.userRef){
            return next(errorHandler(401,'You can only delete your own listing !'));
           }
            try {
                const list=await Listing.findByIdAndDelete(req.params.id);
              return  res.status(200).json({message:"user list has been successfully"});
            } catch (error) {
                  next(error);                
            }
}
export const updatelist=async (req,res,next)=>{
       if(req.body.userRef!=req.user.id){
        return next(errorHandler(401,"user can update his own listing"));
       }
        const listing= await Listing.findById(req.params.id);
        console.log(listing);
       if(!listing){return next(errorHandler(404,"lsit can not find"));} 
       try {
        const updatedList = await Listing.findByIdAndUpdate(req.params.id,req.body
            ,{new :true});
         res.status(200).json(updatedList);
       } catch (error) {
          next(error);
       }

}
export const getList=async (req,res,next)=>{
    try {  
    const listing=await Listing.findById(req.params.id);
       if(!listing){
        return next(errorHandler(404,"list not found"));
       }
         res.status(200).json(listing);
       } catch (error) {
           next(error);
       }
}