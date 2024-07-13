import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
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
    password:{
        type:String,
        required: [true, "Password Is Required!"],
        minLength: [8,"Password Must Contain At Least 8 Characters!"],
        select:false,
    },
    role:{
        type:String,
        required: [true, "User Role Required!"],
        enum: ["Admin", "Patient", "Doctor"],
    },
    doctorDepartment:{
        type:String,
    },
    docAvatar:{
        public_id: String,
        url: String,
    },
}); 


//* create methods
//? userSchema jayare save thai tayare new password aave tayare tene bcrypt karine hash kari nakhe. //! example aapde website ma passowrd nakho 12345 tene hash ma convert kari nakhe jethi koi tene read no kari eke.
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10);
});


//? have jayare je passowrd convert thai gayu e hash ma che and aapde login karvu hoi tai number ma hoi tene compare karvani method

userSchema.methods.comparePassword = async function (enterPassword) {
    return await bcrypt.compare(enterPassword, this.password);
};


//? user jayare login kare tayare Token genrate thavu pade eni method.

userSchema.methods.genrateJsonWebToken = function () {
    return jwt.sign({id:this._id}, process.env.JWT_SECRET_KEY, {    //? aa id ma user ni id ne store karu che.
        expiresIn: process.env.JWT_EXPIRES, 
    })
}


//* message mate model create karvanu.

export const User = mongoose.model("user", userSchema);   //? aapde uper nu banavu ne e ama represent karu messageSchema lkhine.
