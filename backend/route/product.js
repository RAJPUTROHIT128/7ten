const express = require("express")
const router = express.Router();

const { getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct, createProductReview, getProductReview, deleteProductReview } = require("../controllers/productControllers")



const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
//product showing page
router.route("/products").get(getProducts);

//single product description page

router.route("/product/:id").get(getSingleProduct);


//new product adding page
router.route("/admin/product/new").post(isAuthenticatedUser, authorizeRoles("admin"), newProduct);

//Updating Product page

router.route("/admin/product/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct);

//deleting Product page

router.route("/admin/product/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);


router.route("/review").put(isAuthenticatedUser, createProductReview);
router.route("/reviews").get(isAuthenticatedUser, getProductReview);
router.route("/reviews").delete(isAuthenticatedUser, deleteProductReview);

module.exports = router;
