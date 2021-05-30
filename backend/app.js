const express = require("express");
const app = express();
const errorMiddleware = require("./middlewares/errors");

app.use(express.json());

//Import all Routes

const products = require("./route/product");
const auth = require("./route/auth");


app.use("/api/v1", products)
app.use("/api/v1", auth);
//Middleware to handle errors

app.use(errorMiddleware);

module.exports = app