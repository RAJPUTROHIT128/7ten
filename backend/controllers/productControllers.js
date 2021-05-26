const Product = require("../models/product")

//Create new Product  Path(/api/v1/product/new)


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

