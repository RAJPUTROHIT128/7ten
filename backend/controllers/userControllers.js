const User = require("../models/user");

const ErrorHandler = require("../utility/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");

//Register User (/api/v1/register)

exports.registerUser = catchAsyncError(async (req, res, next) =>{
    const { 
        name,
        email,
        password,
    } = req.body;

    const user = await User.create({ 
        name, 
        email, 
        password,
        avatar:{
            public_id: "avatar/man-avatar-profile_de5mut",
            url: "https://res.cloudinary.com/djmhwjrwa/image/upload/v1622361027/avatar/man-avatar-profile_de5mut.jpg",
        }
        })

        const token = user.getJwtToken();

        res.status(201).json({
            success: true,
            token
        })
})

//Login user  (/api/v1/login)
exports.loginUser = catchAsyncError(async (req, res, next) =>{
    const {email, password} = req.body;

    //check if email and password enter by user

    if(!email || !password){
        return next(new ErrorHandler("Please enter email and password", 400));
    }

    // Finding User in database 

    const user = await User.findOne({email}).select("+password")

    if(!user){
        return next( new ErrorHandler("Invalid Email or Password", 401));
    }

    // check if password is correct or not found
    const isPasswordMatch = await user.comparePassword(password);

    if(!isPasswordMatch){
        return next(new ErrorHandler("Invalid Email or Password",401));
    }

    const token = user.getJwtToken();

    res.status(200).json({
        success: true,
        token
    })
})