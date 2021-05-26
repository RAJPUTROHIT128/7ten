const Product = require("../models/product");
const dotenv = require("dotenv");
const connectDatabase = require("../config/database");

const products = require("../data/product");

//Setting dotenv file for connection
dotenv.config({ path: "backend/config/config.env" })

connectDatabase();

//Creating seeder for inserting many data at ones.

const seedProducts = async () =>{
    try{
        //Deleting all previous data from table
        await Product.deleteMany();
        console.log("Products are deleted successfully");

        //inserting new data into table

        await Product.insertMany(products);
        console.log("Products are inserted successfully");

        //Exit from the process 
        process.exit();
    }catch(error){
        console.log("error.message");
        process.exit();
    }
}

seedProducts()