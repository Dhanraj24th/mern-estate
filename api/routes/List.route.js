import express from 'express';
import  {createList}  from '../controllers/listing.controller.js';

const listRouter=express.Router();
 
listRouter.post('/create',createList);

export default listRouter;