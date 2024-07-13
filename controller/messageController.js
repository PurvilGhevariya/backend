import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js"
import { Message } from "../models/messageSchema.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";

export const sendMessage =catchAsyncErrors(async(req,res,next)=> {
    const{ firstName, lastName, email, phone, message } = req.body;   //?frontend mathi aa 5 vastu ne aapde get karvani.
    //* jo uper nu metch no thai to nichenu thai 
    if(!firstName || !lastName || !email || !phone || !message){
        return next(new ErrorHandler("Please Fill Full Form!", 400));
    }
        //* aama je Message che tene messgaeSchema mathi import karvau che.
    await Message.create({firstName, lastName, email, phone, message});     //? je value che tene aapde { } maj aapvani.
    res.status(200).json({
        success: true,
        message: "Message Send Successfully!",
    });
});

//* All message ne get karavu.And aa badha message admin nj joi eke.
export const getAllMessages= catchAsyncErrors(async(req, res, next)=>{
    const messages = await Message.find();
    res.status(200).json({
        success: true,
        messages,
    });
    return next(new ErrorHandler(" "))
})