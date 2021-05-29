const mongoose = require('mongoose');
const validator = require('validator');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter yout Name"],
        maxLength: [30, "Your name cannot exceed 30 characters"]
    },
    email:{
        type: String,
        required: [true, "Please Enter yout Email address"],
        unique: true,
        validate: [validator.isEmail,"Please enter valid email address"]
    },
    password:{
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength:[6, "Your password must be at least 6 characters"],
        select: false
    },
    avatar:{
        public_id:{
            type: String,
            required: true
        },
        url:{
            type: String,
            required: true
        }
    }, 
    role:{
        type: String,
        default: "user"
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
})