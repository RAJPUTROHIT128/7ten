const Order = require("../models/order");
const Product = require("../models/product");

const ErrorHandler = require("../utility/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");

//create a new Order

exports.newOrder = catchAsyncError(async (req, res, next) =>{
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    }= req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id
    })

    res.status(200).json({
        success: true,
        order
    })

})

//get single Order (/api/v1/order/:id)
exports.getSingleOrder = catchAsyncError(async (req, res, next) =>{
    const order = await Order.findById(req.params.id).populate("user", "name email")
    if(!order){
        return next(new ErrorHandler("No order found by this id", 404));
    }
    res.status(200).json({
        success: true,
        order
    })
})

//get Loggedin user Order (/api/v1/order/:id)
exports.myOrders = catchAsyncError(async (req, res, next) =>{
    const orders = await Order.find({user: req.user._id});
   
    res.status(200).json({
        success: true,
        orders
    })
})