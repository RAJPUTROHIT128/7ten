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