const Product = require("../models/product")

const ErrorHandler = require("../utility/errorHandler");

const catchAsyncError = require("../middlewares/catchAsyncError");

const APIFeatures = require("../utility/apifeatures");

//Create new Product  Path(/api/v1/admin/product/new)


exports.newProduct = catchAsyncError(async(req, res, next) =>{

    req.body.user = req.user.id;

    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })
})

//getting all products (/api/v1/products?keyword=laptop)

exports.getProducts = catchAsyncError(async (req, res, next) =>{

    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();
    
    const apifeatures = new APIFeatures(Product.find(),req.query)
                        .search()
                        .filter()
                        .pagination(resultPerPage)


        const products = await apifeatures.query;

            res.status(200).json({
                success: true,
                //count: products.length
                productsCount,
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

//Create new review   (/api/v1/review)

exports.createProductReview = catchAsyncError(async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )

    if (isReviewed) {
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })

    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }

    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    })

})

//Get product review  (/api/v1/reviews)

exports.getProductReview = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})

//delete review of products (/api/v1/reviews)
exports.deleteProductReview = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());

    const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    const numofReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numofReviews
    },{
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})