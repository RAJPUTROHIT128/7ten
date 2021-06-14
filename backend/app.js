const express = require("express");
const app = express();
const errorMiddleware = require("./middlewares/errors");
const cookieParser = require("cookie-parser");
const bodyparser = require("body-parser");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary");


app.use(express.json());
app.use(cookieParser());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(fileUpload());
//Import all Routes

const products = require("./route/product");
const auth = require("./route/auth");
const order = require("./route/order");


app.use("/api/v1", products)
app.use("/api/v1", auth);
app.use("/api/v1", order);

//Middleware to handle errors

app.use(errorMiddleware);

//Setting up cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

module.exports = app