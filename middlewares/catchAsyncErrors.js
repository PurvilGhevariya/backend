//? validation mate error aavi to aakhu server down thai gayuto ena mate aa middleware banavu

export const catchAsyncErrors = (thefunction) =>{
    return(req, res, next) => {
        Promise.resolve(thefunction(req, res, next)).catch(next);
    }
};