const mongoose=require('mongoose')
const ObjectId=mongoose.Schema.Types.ObjectId
const cartSchema= new mongoose.Schema({
    userId: {
        type:ObjectId,
        ref:"UserCollection",
        required:[true,"Please Enter user id"],
        unique:true
    },
    items: [{
      productId: {
        type:ObjectId,
        ref:"ProductCollection",
        required:[true,"please provide product id"]
    },
      quantity: {
        type:Number,
        required:[true,"please select the quatity"],
        min: 1
    }
    }],
    totalPrice: {
        type:Number, 
        required:[true, "Please Enter total price"], 
        comment: "Holds total price of all the items in the cart"
    },
    totalItems: {
        type:Number, 
        required:[true,"please Enter total items "],
        comment: "Holds total number of items in the cart"
    }
},{timestamps:true})
module.exports=mongoose.model("CartCollection",cartSchema)