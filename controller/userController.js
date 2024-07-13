import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import {genrateToken} from "../utils/jwtToken.js";
import cloudinary from "cloudinary";


//* aa function patient mate.
export const patientRegister = catchAsyncErrors(async(req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    dob,
    nic,
    role,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !password ||
    !gender ||
    !dob ||
    !nic ||
    !role
    ){
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  let user = await User.findOne({email});
  if (user) {
    return next(new ErrorHandler("User Alreay Registered!", 400));
  }
  user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    dob,
    nic,
    role,
  });
  genrateToken(user, "user Reistered!", 200, res);
  //* AA 4 line na code ne uper ni 1 line ma convert karo che.
    // res.status(200).json({
    //     success: true,
    //     message: "user Reistered!",
    // });
});



//* login activity.
export const login = catchAsyncErrors(async(req, res, next)=> {
  const{email, password,confirmPassword, role} = req.body;
  if (!email || !password || !confirmPassword || !role){
    return next(new ErrorHandler("Please Provide All Details!", 400))
  }
  if (password !== confirmPassword) {
    return next(new ErrorHandler("Password And Confirm Password Do not Match!", 400))
  }

  //* jo user e login barabar karu pachi aapde database ma jovanu ke user aa cheke nai em.
  const user =await User.findOne({email}).select("+password");
  if(!user){
    return next(new ErrorHandler("Invalid Password Or Email!", 400))
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Password Or Email!", 400))
  }
  if (role !== user.role) { //? user e mokalelu role and je exisiting role e metch no thai
    return next(new ErrorHandler("User Width This Role Not Found!", 400))    
  }

  //* aa badhu mali jai to 
  //* AA 4 line na code ne uper ni 1 line ma convert karo che.
  genrateToken(user, "User Logged In Successfully!", 200, res);
  // res.status(200).json({
  //   success: true,
  //   message: "User Logged In Successfully!",
  // });
});




//* new admin create kai rite thai tena mate.
export const addNewAdmin = catchAsyncErrors(async(req, res, next)=>{
  const{
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    dob,
    nic
  } = req.body;   //? pela aatli vastu body mathi get kari
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !password ||
    !gender ||
    !dob ||
    !nic ){
    return next(new ErrorHandler("Please Fill Full Form!", 400));   //? and jo aamathi ek pan jo no hoi to aa err aavse.
  }
  //* admin alreay register che ke nai te check karva mate.
  const isRegistered = await User.findOne({email});
  if (isRegistered) {
    return next(new ErrorHandler(`${isRegistered.role} With This Email Already Exists!`))
  }
  //* jo admin no malo to new admin create karvano.
  const admin = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    dob,
    nic,
    role:"Admin"});
    res.status(200).json({
      success: true,
      message: "New Admin Registered!",
    });
});

//* badha doctor na name get karva mate.
export const getAllDoctor = catchAsyncErrors(async(req, res, next)=>{
  const doctors = await User.find({role:"Doctor"});
  res.status(200).json({
    success:true,
    doctors,
  });
});

//* user ni badhi detailes ne get karva mate.
export const getUserDetails = catchAsyncErrors(async(req, res, next)=>{
  const user = req.user;
  res.status(200).json({
    success:true,
    user,
  });
});
//* Admin logout function
export const logoutAdmin = catchAsyncErrors(async(req, res, next )=>{
  res.status(200).cookie("adminToken", "", {
    httpOnly : true,
    expires : new Date(Date.now()),
    secure:true,
    sameSite:"None",
  }).json({
    success: true,
    message: "Admin Log Out Successfully!",
  });
});

//* Patient logout function
export const logoutPatient = catchAsyncErrors(async(req, res, next )=>{
  res.status(200).cookie("patientToken", "", {
    httpOnly : true,
    expires : new Date(Date.now()),
  }).json({
    success: true,
    message: "Patient Log Out Successfully!",
  });
});




//* New Doctor ne ADD karvano Aa function
export const addNewDoctor = catchAsyncErrors(async(req, res, next)=>{
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Doctor Avatar Required", 400));
  }
  const {docAvatar} = req.files;
  const allowedFormats = ["image/png","image/jpeg", "image/webp"];
  if (!allowedFormats.includes(docAvatar.mimetype)) {   //? mimtype means  ke user na extention ne match kare.//! for Example image ni mp4 video nakhi didho to ema error batave.
    return next(new ErrorHandler("File Format Not Supported!", 400));
  }
  const { 
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    doctorDepartment
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !password ||
    !gender ||
    !dob ||
    !nic ||
    !doctorDepartment
  ) {
    return next(new ErrorHandler("Please Provide Full Details!", 400));
  }
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler(`${isRegistered.role} already registered with this email!`, 400));
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(docAvatar.tempFilePath);
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown Cloudinary Error");
  }
  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    dob,
    nic,
    doctorDepartment,
    role: "Doctor",
    docAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "New Doctor Register!",
    doctor
  });
});
