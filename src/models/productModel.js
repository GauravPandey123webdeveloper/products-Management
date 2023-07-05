const mongoose= require('mongoose')
const productSchema= new mongoose.Schema({ 
    title: {
        type:String,
        trim:true,
        required:[true,"please Enter the title"],
        unique:true
    },
    description: {
        type:String, 
        trim:true,
        required:[true,"Please enter the description"]    
    },
    price: {
        type:Number,
        required:[true,"Please Enter the price"],
    },
    currencyId: {
        type:String,
        required:[true,"please provide currency Id in INR"]
    },
    currencyFormat: {
        type:String,
        required:[true,"Please enter currency format in rupee symbol"]
    },
    isFreeShipping: {
        type:Boolean,
         default: false
        },
    productImage: {
        type:String,
        required:[true,"Please Enter the product image address"]
    },  
    style: {
        type:String
    },
    availableSizes: {
        type: [{
            type: String,
            enum: ["S", "XS", "M", "X", "L", "XXL", "XL"]
        }],
        required: [true, "Please select at least one size"],
        validate: {
            validator: function (availableSizes) {
              return availableSizes.length > 0;
            },
            message: "Please select at least one size"
          }
    },
    installments: {
        type:Number
    },
    deletedAt: {
        type:Date,
        default:null
    }, 
    isDeleted: {
        type:Boolean,
        default: false
    }
  },{timestamps:true})
  module.exports= mongoose.model('ProductCollection',productSchema)