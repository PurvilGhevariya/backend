import express from "express";
import {config} from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbConnection } from "./database/dbConnection.js"
import  messageRouter from "./router/messgaeRouter.js"
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js"


//* env file setup.
const app = express();
config({ path: "./config/config.env" }); //? config file ne connect kari.


//* create a middlewares...
//* frontend to backend connection  
app.use(
    cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],  //? project ma kai kai method use karvna cho e lkhi che.
    credentials: true,  
})
);

//* backend mate cookies ne get karva mate use thai aa middleware no.
app.use(cookieParser()); //? cookies ne gt karva mate.
app.use(express.json()); //? data json formate aave tene string ma pars karva mate. 
app.use(express.urlencoded({ extended: true }));    //? data je aave backend ma jem ke name and date e bhadha ne recognize karva mate use thai.

//* file upload middleware.
app.use(
    fileUpload({
        useTempFiles: true,     
        tempFileDir: "/tmp/",   //? aa /tmp/ aa vastu ena document ma lkheli hati e j lkheli che.
    })
);

//* router mate middleware setup karu.
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);

dbConnection();


app.use(errorMiddleware);
export default app;
