const Order = require("../models/order");
const Product = require("../models/product");

const ErrorHandler = require("../utility/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");
const order = require("../models/order");

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

//get Loggedin user Order (/api/v1/orders/me)
exports.myOrders = catchAsyncError(async (req, res, next) =>{
    const orders = await Order.find({user: req.user._id});
   
    res.status(200).json({
        success: true,
        orders
    })
})

//get all Order (/api/v1/admin/orders)
exports.allOrders = catchAsyncError(async (req, res, next) =>{
    const orders = await Order.find();

    let totalAmount = 0;
    orders.forEach(order =>{
        totalAmount += order.totalPrice;
    })
   
    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})

//Update Order (/api/v1/admin/order/:id)
exports.updateOrder = catchAsyncError(async (req, res, next) =>{
    const order = await Order.findById(req.params.id);

    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("You have already delivered this order", 400));
    }

    order.orderItems.forEach(async item =>{
        await updateStock(item.product, item.quantity);
    })

    order.orderStatus = req.body.status,
    order.deliveredAt = Date.now()

    await order.save();
    

    res.status(200).json({
        success: true,
    })
})

async function updateStock(id, quantity) {
    const product = await Product.findById(id);

    product.stock = product.stock - quantity;

    await product.save({validateBeforeSave: false});
}

//get single Order (/api/v1/admin/order/:id)
exports.deleteOrder = catchAsyncError(async (req, res, next) =>{
    const order = await Order.findById(req.params.id)
    if(!order){
        return next(new ErrorHandler("No order found by this id", 404));
    }
    await order.remove();

    res.status(200).json({
        success: true
    })
})
