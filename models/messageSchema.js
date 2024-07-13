import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: [3,"First Name Must Contain At Least 3 Characters! "]
    },
    lastName: {
        type: String,
        required: true,
        minLength: [3,"First Name Must Contain At Least 3 Characters! "]
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail,"Please Provide A Valid Email!"]   //? aapde je email nakhvi te valid che ke nai te check kare.
    },
    phone: {
        type: String,   //? aapde validation lagadi ekvi etle String rakhu che 
        required: true,
        minLength: [10,"Phone Number Must Contain Exact 11 Digit!"],
        maxLength: [10,"Phone Number Must Contain Exact 11 Digit!"],
    },
    message: {
        type: String,
        required: true,
        minLength: [10,"Message Must Contain At Least 10 Characters! "]
    },
}); 

//* message mate model create karvanu.

export const Message = mongoose.model("Message", messageSchema);   //? aapde uper nu banavu ne e ama represent karu messageSchema lkhine.
