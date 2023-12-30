import express from 'express';
import  {createList, getListing,deleteList}  from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyToken.js';

const listRouter=express.Router();
 
listRouter.post('/create',verifyToken,createList);
listRouter.get('/read/:id',verifyToken,getListing);
listRouter.delete("/delete/:id",verifyToken,deleteList);
listRouter.put('/update/:id',verifyToken,updatelist);
export default listRouter;