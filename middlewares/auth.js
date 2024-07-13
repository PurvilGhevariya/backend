//* admin ne only admin add kari eke ena mate authentication ni jarur pade. nakar to game te admin bani shake.
import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./errorMiddleware.js";
import jwt from "jsonwebtoken";

//* AA function ma Authentication and authorized bane thai che.
export const isAdminAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.adminToken; //? addmintoken ne get karu.
  //* jo uper nu token mali jai to nicheni if vali condition run no thai
  //* jo admin token no hoi to aa error throw kare.
  if (!token) {
    return next(new ErrorHandler("Admin Not Authenticated!", 400));
  }
  // * jo token mali jai to jwt ne vrify karvanu. ke te apde j genrate karu ke bija kok e.
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decoded.id); //? aa id te userSchema ma line 84 ma {id:this._id} aa id ne get kare che.
  
  //* AA authorization proccess che.
  if (req.user.role !== "Admin") {
    return next(
      new ErrorHandler(
        `${req.user.role} Not Authorized For This Resources!`,
        403
      )
    );
  }
  next();
});

//* AA function ma Authentication and authorized bane thai che.
export const isPatientAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.patientToken; //? addmintoken ne get karu.
    //* jo uper nu token mali jai to nicheni if vali condition run no thai
    //* jo admin token no hoi to aa error throw kare.
    if (!token) {
      return next(new ErrorHandler("Patient Not Authenticated!", 400));
    }
    // * jo token mali jai to jwt ne vrify karvanu. ke te apde j genrate karu ke bija kok e.
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id); //? aa id te userSchema ma line 84 ma {id:this._id} aa id ne get kare che.
    
    //* AA authorization proccess che.
    if (req.user.role !== "Patient") {
      return next(
        new ErrorHandler(
          `${req.user.role} Not Authorized For This Resources!`,
          403
        )
      );
    }
    next();
  });