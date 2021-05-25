const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name:{
       type: String,
       required: [true, "Please enter the product name"],
       trim: true,
       maxLength: [100,"Product name cannot exceed 100 character"] 
    },
    price:{
        type: Number,
        required: [true, "Please enter the product price"],
        maxLength: [5,"Product price cannot exceed 5 character"],
        default: 0.0 
     },
     description:{
        type: String,
        required: [true, "Please enter the product Description"],
        
     },
     ratings: {
         type: Number,
         default: 0,
     },
     iamges:[
         {
             public_id:{
                 type: String,
                 required: true,
             },
             url:{
                 type: String,
                 required: true,
             }
         }
     ],
     category:{
         typr:String,
         required: [true, "Please select category for this product"],
         enum: {
             values:[
                 "Electronics",
                 "Camera",
                 "Laptop",
                 "Accessories",
                 "Headphones",
                 "Food",
                 "Books",
                 "Shoes",
                 "Clothes",
                 "Sports"
             ],
             message: "Please select correct category for product"
         }
     },
     seller:{
         type:String,
         required:[true,"Please enter product seller"]
     },
     stock:{
         type:Number,
         required: [true, "Please enter product stock"],
         maxLength: [5, "Product name cannot exceed 5 characters"],
         default: 0
     },
     numofReviews: {
         type: Number,
         default: 0
     },
     reviews:[
         {
             name:{
                 type: String,
                 required: true 
             },
             rating:{
                 type: Number,
                 required: true
             },
             comment:{
                 type: String,
                 required: true
             }
         }
     ],
     createdAt:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Product", productSchema);