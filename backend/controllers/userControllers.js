const User = require("../models/user");
const crypto = require("crypto");
const ErrorHandler = require("../utility/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");
const sendToken = require("../utility/jwtToken");
const sendEmail = require("../utility/sendEmail");

const cloudinary = require("cloudinary");

//Register User (/api/v1/register)

exports.registerUser = catchAsyncError(async (req, res, next) =>{
    
    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatar",
        width: 150,
        crop: "scale"
    })

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
            public_id: result.public_id,
            url: result.secure_url
        }
        })

        sendToken(user, 200, res)
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

    sendToken(user, 200, res)
})

//Forgot Password (/api/v1/password/forgot)

exports.forgotPassword = catchAsyncError(async (req, res, next) =>{
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return next(new ErrorHandler("User not found with this email",404));
    }

    //Get resetToken

    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false})

    //Create resetPassword url
    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is generated:\n\n${resetUrl}\n\n If you do not requested this email, then please ignore it.`

    try{
        await sendEmail({
            email:user.email,
            subject: "7ten Password Recovery mail",
            message
        })


        res.status(200).json({
            success: true,
            message: `Email send to: ${user.email}`
        })

    }catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave: false})
        return next(new ErrorHandler(error.message, 500));
    }

})

//Reset Password (api/v1/password/reset/:token)
exports.resetPassword = catchAsyncError(async (req, res, next) =>{
    //Hash Url sendToken
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now()}
    })

    if(!user){
        return next(new ErrorHandler("Password reset token is invalid or has been expired",400))
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match", 400));
    }

    //Setup new password

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user,200,res);


})

//Get currrent login user (/api/v1/me)
exports.getUserProfile = catchAsyncError(async (req, res, next) =>{
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })
})

//update Password (/api/v1/password/update)
exports.updatePassword = catchAsyncError(async (req, res, next) =>{
    const user = await User.findById(req.user.id).select("+password");

    const isMatch = await user.comparePassword(req.body.oldPassword);
    if(!isMatch){
        return next(new ErrorHandler("Old password is Incorrect"));
    }

    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res);
})

//Update User Profile (/api/v1/me/update)
exports.updateProfile = catchAsyncError(async (req, res, next) =>{
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    //Update Profile

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        userFindAndModify: false
    })

    res.status(200).json({
        success: true,

    })


})



//Logout User (/api/v1/logout)

exports.logoutUser  = catchAsyncError(async (req, res, next) =>{
    res.cookie("token", null, { 
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: "Logout User"
    })
})


//Admin routes

//Get all users (/api/v1/admin/users)

exports.getAllUsers = catchAsyncError(async (req, res, next) =>{
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
})


//Get user details (/api/v1/admin/user/:id)
exports.getUserDetails = catchAsyncError(async (req, res, next) =>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        user
    })
})

//Update User Profile (/api/v1/admin/user/:id)
exports.updateUser = catchAsyncError(async (req, res, next) =>{
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role:req.body.role
    }

    //Update Profile

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        userFindAndModify: false
    })

    res.status(200).json({
        success: true,

    })
})

//Delete user  (/api/v1/admin/user/:id)
exports.deleteUser = catchAsyncError(async (req, res, next) =>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
    }

    //Remove avatar 

    
    await user.remove();

    res.status(200).json({
        success: true,
    })
})
