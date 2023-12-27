import express from 'express';
import  {createList, getListing}  from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyToken.js';

const listRouter=express.Router();
 
listRouter.post('/create',verifyToken,createList);
listRouter.get('/list/:id',verifyToken,getListing);
export default listRouter;