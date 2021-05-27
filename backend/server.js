const app = require("./app");
const connectDatabase = require("./config/database");

const dotenv = require("dotenv");

//Handle Uncaught Exception
process.on("uncaughtException",err =>{
    console.log(`Error: ${err.stack}`);
    console.log("Shutting down server due to uncaughtException");
    process.exit(1);
})

//Setting up configuration file

dotenv.config({ path: "backend/config/config.env"})



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