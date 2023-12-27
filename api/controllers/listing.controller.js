import Listing from "../models/Listing.model.js"
import { errorHandler } from "../utils/errorHandler.js";

export const createList=async (req,res,next)=>{
    if(req.params.id!=req.user.id) return next(errorHandler(401,"user can fetch his own listing"));
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
                return res.status(200).json(listing);
            } catch (error) {
                next(error);
            }
}