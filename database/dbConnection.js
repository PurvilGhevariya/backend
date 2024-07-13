// data base ne connect karva mate database nanmu folder banavu

import mongoose from "mongoose";

export const dbConnection = () =>{
    mongoose.connect(process.env.MONGO_URL,{
        dbName: "MERN_STACK_HOSPITAL_MANAGEMENT_SYSTEM"
    }).then(() => {
        console.log("Connected to the database!")
    }).catch((err) => {
        console.log(`Some error o   ccured while connecting to the database: ${err}`);
    });
}; 