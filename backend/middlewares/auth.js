const catchAsyncError = require("../middlewares/catchAsyncError");
const ErrorHandler = require("../utility/errorHandler");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Check if user is Authenticated or not

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) =>{

    const {token} = req.cookies
    //console.log(token);
    if(!token){
        return next(new ErrorHandler("Login first to access this resource", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id);

    next()
})

//Handling Users Roles

exports.authorizeRoles = (...roles) =>{
    return (req, res, next) =>{
        if(!roles.includes(req.user.role)){
            return next(
            new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource`,403))
        }
        next()
}
}