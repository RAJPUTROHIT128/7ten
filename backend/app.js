const express = require("express");
const app = express();

app.use(express.json());

//Import all Routes

const products = require("./route/product");

app.use("/api/v1", products)

module.exports = app