//* cookies genrate karavvanu che aama.

export const genrateToken = (user, message, statusCode, res) => {
  const token = user.genrateJsonWebToken();
  //* Aama aapdi pase 2 frontend che.
  //* 1. Admin dashboad   2. frontend
  //* Jo user admin hoi to adminToken genrate kare and jo patient hoi patientToken genrate kare.
  const cookieName = user.role === "Admin" ? "adminToken" : "patientToken";
  res
    .status(statusCode)
    .cookie(cookieName, token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ), //? (hour, min, second, milisecond)//! 7 divas paci cookies expire thai jase.
      httpOnly : true,
      secure:true,
      sameSite:"None",
    })
    .json({
      success: true,
      message,
      user,
      token,
    });
};
