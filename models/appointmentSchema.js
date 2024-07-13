import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First Name Is Required!"],
        minLength: [3,"First Name Must Contain At Least 3 Characters! "]
    },
    lastName: {
        type: String,
        required: [true, "Last Name Is Required!"],
        minLength: [3,"First Name Must Contain At Least 3 Characters! "]
    },
    email: {
        type: String,
        required: [true, "Email Is Required!"],
        validate: [validator.isEmail, "Please Provide A Valid Email!"]   //? aapde je email nakhvi te valid che ke nai te check kare.
    },
    phone: {
        type: String,   //? aapde validation lagadi ekvi etle String rakhu che 
        required: [true, "Phone Is Required!"],
        minLength: [10,"Phone Number Must Contain Exact 10 Digit!"],
        maxLength: [10,"Phone Number Must Contain Exact 10 Digit!"],
    },
    nic: {
        type: String,
        required: [true, "NIC Is Required!"],
        minLength: [12,"NIC Must Contain Only 12 Digit!"],
        maxLength: [12,"NIC Must Contain Only 12 Digit!"],
    },
    dob:{
        type:Date,
        required:[true, "DOB is required!"],        
    },
    gender:{
        type:String,
        required: [true, "Gender Is Required!"],
        enum: ["Male" , "Female",],
    },
    appointment_date: {
        type: String,
        required: true,
    },
    department:{
        type: String,
        required: true,
    },
    doctor:{
        firstName:{
            type: String,
            required: true,
        },
        lastName:{
            type:String,
            required: true,
        }
    },
    hasVisited:{
        type: Boolean,
        default: false,
    },
    doctorId: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    patientId: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum:["Pending", "Accepted", "Rejected"],
        default: "Pending",
    },
}); 

export const Appointment = mongoose.model("Appointment", appointmentSchema);

