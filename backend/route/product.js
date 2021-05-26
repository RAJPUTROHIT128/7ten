const express = require("express")
const router = express.Router();

const { getProducts, newProduct } = require("../controllers/productControllers")

//product showing page
router.route("/products").get(getProducts);


//new product adding page
router.route("/product/new").post(newProduct);

module.exports = router;
