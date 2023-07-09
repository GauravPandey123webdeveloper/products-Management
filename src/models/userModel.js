const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    fname: { 
        type:String,
        required:[true,"please enter first name"]    
    },
    lname: { 
        type:String,
        required:[true,"please enter last name"]    
     },
    email: { 
        type:String,
        required:[true,"please enter email id"],
        unique:true
    },
    profileImage: { 
        type:String,
        required:[true,"please add profile image"]    
    }, // s3 link
    phone: { 
        type:String,
        required:[true,"please enter mobile number "],
        unique: true    
     },
    password: { 
        type:String,
        required:[true,"please enter the password"]    
    }, // encrypted password
    address: {
        shipping: {
            street: {
                type:String,
                required:[true,"please Enter the street"]         
            },
            city: { 
                type:String,
                required:[true,"please enter city"]    
             },
            pincode: { 
                type:String,
                required:[true,"please enter Pincode"]    
             }
        },
        billing: {
            street: {
                type:String,
                required:[true,"please Enter the street"]         
            },
            city: { 
                type:String,
                required:[true,"please enter city"]    
             },
            pincode: { 
                type:String,
                required:[true,"please enter Pincode"]    
             }
        }
    }
},{timestamps:true})
module.exports= mongoose.model("UserCollection",userSchema)