const app = require("./app");
const connectDatabase = require("./config/database");

const dotenv = require("dotenv");
const cloudinary = require("cloudinary");

//Handle Uncaught Exception
process.on("uncaughtException",err =>{
    console.log(`Error: ${err.stack}`);
    console.log("Shutting down server due to uncaughtException");
    process.exit(1);
})

//Setting up configuration file

dotenv.config({ path: "backend/config/config.env"})

//Setting up cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

//connecting to Database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on port: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
})

//Handle Unhandled Promise rejection

process.on("unhandledRejection", err => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Unhandled Promise Rejection");
    server.close(() =>{
        process.exit(1);
    })
})