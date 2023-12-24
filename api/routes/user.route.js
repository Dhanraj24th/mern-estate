import express from "express";
import { test, updateUser ,deleteUser, signout} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router=express.Router();

router.get('/test',test);
router.post('/update/:id',verifyToken,updateUser);
router.delete('/delete/:id',verifyToken,deleteUser);
router.get('/sign/:id',verifyToken,signout);
export default router;