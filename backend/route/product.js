const express = require("express")
const router = express.Router();

const { getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct } = require("../controllers/productControllers")



const { isAuthenticatedUser } = require("../middlewares/auth");
//product showing page
router.route("/products").get(isAuthenticatedUser, getProducts);

//single product description page

router.route("/product/:id").get(getSingleProduct);


//new product adding page
router.route("/admin/product/new").post(newProduct);

//Updating Product page

router.route("/admin/product/:id").put(updateProduct);

//deleting Product page

router.route("/admin/product/:id").delete(deleteProduct);

module.exports = router;
