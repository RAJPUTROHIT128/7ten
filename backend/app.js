const express = require("express");
const app = express();
const errorMiddleware = require("./middlewares/errors");
const cookieParser = require("cookie-parser");


app.use(express.json());
app.use(cookieParser())
//Import all Routes

const products = require("./route/product");
const auth = require("./route/auth");
const order = require("./route/order");


app.use("/api/v1", products)
app.use("/api/v1", auth);
app.use("/api/v1", order);
//Middleware to handle errors

app.use(errorMiddleware);

module.exports = app