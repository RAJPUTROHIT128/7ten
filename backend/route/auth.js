const express = require('express');
const router = express.Router();

const {registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserProfile, updatePassword} = require("../controllers/userControllers");

const {isAuthenticatedUser} = require("../middlewares/auth");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isAuthenticatedUser, getUserProfile);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/logout").get(logoutUser);
module.exports = router;