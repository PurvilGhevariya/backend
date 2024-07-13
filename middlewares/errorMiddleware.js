//? server down thai gayu tu to enu kak che.
class ErrorHandler extends Error{
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

//* err middleware
export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal server Error";
    err.statusCode = err.statusCode || 500;

    if (err.code === 11000) {   //? 11000  kayare aave jayare aapde same value occured thai //! example:-- user1 e ek email nakhi che and user2 e pan same email nakhi che to 11000 code disply kare 
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;   //? ${Object.keys(err.keyValue)} eno meaning em ke aa [(err.keyValue)] err ni andar key valueche ne ene get karvani che.
        err = new ErrorHandler(message, 400); 
    }
    if (err.name === "jsonWebTokenError") {
        const message = "json Web Token is invalid, Try Again!";
        err = new ErrorHandler(message, 400);        
    }
    if (err.name === "TokenExpiredError") {
        const message = "json Web Token is Expired, Try Again!";
        err = new ErrorHandler(message, 400);        
    }
    if (err.name === "CastError") {    //? type and validation ma kak error hoi to cast error aave.
        const message = `Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);        
    }
    //* only error na message ne print karavva mate.
    const errorMessage = err.errors ? Object.values(err.errors).map((error) => error.message).join(" "): err.message;

    return res.status(err.statusCode).json({
        success: false,
        message: errorMessage,
    });
}
export default ErrorHandler; 