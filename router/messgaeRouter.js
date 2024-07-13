import express from "express";
import { getAllMessages, sendMessage } from "../controller/messageController.js";
import {isAdminAuthenticated} from "../middlewares/auth.js";

const router = express.Router();    //? router ne define karu.

router.post("/send", sendMessage);
router.get("/getall",isAdminAuthenticated, getAllMessages); //? means ke je admin authenicated hoi te j All message get kari eke. 


export default router;