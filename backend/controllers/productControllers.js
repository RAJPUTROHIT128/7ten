const Product = require("../models/product")

const ErrorHandler = require("../utility/errorHandler");

const catchAsyncError = require("../middlewares/catchAsyncError");

const APIFeatures = require("../utility/apifeatures");

//Create new Product  Path(/api/v1/admin/product/new)


exports.newProduct = catchAsyncError(async(req, res, next) =>{

    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })
})

//getting all products (/api/v1/products?keyword=laptop)

exports.getProducts = catchAsyncError(async (req, res, next) =>{

    const resultPerPage = 4;
    const productCount = await Product.countDocuments();
    
    const apifeatures = new APIFeatures(Product.find(),req.query)
                        .search()
                        .filter()
                        .pagination(resultPerPage)


        const products = await apifeatures.query;
        res.status(200).json({
            success: true,
            count: products.length,
            productCount,
            products
        })
})


//getting single product description (/api/v1/product/:id)

exports.getSingleProduct = catchAsyncError(async (req, res, next) =>{

        const product = await Product.findById(req.params.id);

        if(!product){
            return next(new ErrorHandler("Product not found", 404));
        }

        res.status(200).json({
            success: true,
            product
        })
})


//Updating Product (/api/v1/admin/product/:id)

exports.updateProduct = catchAsyncError(async (req, res, next) => {
        let product = await Product.findById(req.params.id);

        if(!product){
            return next(new ErrorHandler("Product not found", 404));
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body,{
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        res.status(200).json({
            success: true,
            product
        })
})


//Deleting Product   (/api/v1/admin/product/:id)

exports.deleteProduct = catchAsyncError(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

        if(!product){
            return next(new ErrorHandler("Product not found", 404));
        }

        await product.remove();

        res.status(200).json({
            success: true,
            message: 'Product is successfully removed'
        })
})