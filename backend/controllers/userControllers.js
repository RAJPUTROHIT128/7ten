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

        res.status(201).json({
            success: true,
            user
        })
})