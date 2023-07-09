const cartModel= require('../models/cartModel')
const productModel = require('../models/productModel')
const userModel = require('../models/userModel')
const valid = require('../validations/valid')
const createCart= async function(req,res){
try {
    const userId=req.params.userId
    const {productId,cartId,quantity}=req.body
    if(!userId||!productId){
        return res.status(400).send({status:false,message:"Please enter the required details"})
    }
    if(!valid.isValidObjectId(userId)){
       return res.status(400).send({status:false,message:"Please enter the valid user id"})
    }
    if(!valid.isValidObjectId(productId)){
        return res.status(400).send({status:false,message:"Please enter the valid product id"})
    }
    if(cartId&&!valid.isValidObjectId(cartId)){
        return res.status(400).send({status:false,message:"Please enter the valid cart id"})
    }
    const user= await userModel.findOne({_id:userId})
    if(!user){
        return res.status(404).send({status:false,message:"user not found"})
    }
    const product= await productModel.findOne({_id:productId,isDeleted:false});
    if(!product){
        return res.status(404).send({status:false,message:"product not found"})
    }
    let result={}
    const cart= await cartModel.findOne({_id:cartId,userId:userId,isDeleted:false});
    if(cart){
        let check=0;
        for(let item of cart.items){
            if(item.productId==productId){
                result.items.push({productId:productId,quantity:quantity})
                result.totalPrice=quantity*product.price
                check++;
            }
        }
        
       const data= await cart.save()
       return res.status(201).send({status:false,message:"success",data:data})

    }else{

    }


} catch (error) {
    if(error.message.includes('validation')){
        return res.status(400).send({status:false, message:error.message})
    }else if(error.message.includes('duplicate')){
        return res.status(400).send({status:false, message:error.message})
    }else{
        return res.status(500).send({status:false, message:error.message})
    }
}
}
module.exports.createCart=createCart