const Product = require("../models/product")

//Create new Product  Path(/api/v1/admin/product/new)


exports.newProduct = async(req, res, next) =>{
    try{
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })}
    catch(error){
        console.log(error);
    }
}

//getting all products (/api/v1/products)

exports.getProducts = async (req, res, next) =>{
    try{
        const products = await Product.find();
        res.status(200).json({
            success: true,
            count: products.length,
            products
        })
    }catch(error){
        console.log(error.message);
    }
}


//getting single product description (/api/v1/product/:id)

exports.getSingleProduct = async (req, res, next) =>{

    try{
        const product = await Product.findById(req.params.id);

        if(!product){
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }

        res.status(200).json({
            success: true,
            product
        })
    }catch(error){
        console.log(error.message);
    }
}


//Updating Product (/api/v1/admin/product/:id)

exports.updateProduct = async (req, res, next) => {
    try{
        let product = await Product.findById(req.params.id);

        if(!product){
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
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

    }catch(error){
        console.log(error.message);
    }
}


//Deleting Product   (/api/v1/admin/product/:id)

exports.deleteProduct = async (req, res, next) => {

    const product = await Product.findById(req.params.id);

        if(!product){
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }

        await product.remove();

        res.status(200).json({
            success: true,
            message: 'Product is successfully removed'
        })
}