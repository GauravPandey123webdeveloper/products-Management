const orderModel= require('../models/orderModel');
const userModel = require('../models/userModel');
const productModel=require('../models/productModel')
const valid= require('../validations/valid')
function TotalPrice(items, products) {
    let totalPrice = 0;
    for (const item of items) {
      const product = products.find(
        (product) => product._id.toString() === item.productId.toString()
      );
      if (product) {
        totalPrice += product.price * item.quantity;
      }
    }
    return totalPrice;
  }
const createOrder=async function(req,res){
    try {
      const userId = req.params.userId;
      const data = req.body;
      const {items, cancellable,status}=data
      if (!userId || !items) {
        return res.status(400).send({ status: false, message: "Please enter the required values." });
      }
      if (!valid.isValidObjectId(userId)) {
        return res.status(400).send({ status: false, message: "Please enter a valid userId." });
      }
      // because items in the body is kind of array so after iterating we can get the productId , after getting it , i am checking validation for it
      for (let product of items) {
        if (!valid.isValidObjectId(product.productId)) {
          return res.status(400).send({ status: false, message: "Please enter a valid productId." });
        }
      }
      // checking user like it exist or not
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).send({ status: false, message: "User not found." });
      }
      // creating array of productId after seperating from array(items)
      const productIds = items.map((item) => item.productId);
      // checking that product exist or not
      const products = await productModel.find({
        _id: { $in: productIds }, 
        isDeleted: false,
      });
  
      if (products.length !== productIds.length) {
        return res
          .status(404)
          .send({
            status: false,
            message: "Invalid product(s) or product(s) not found.",
          });
      }
      const order= await orderModel.findOne({userId:userId,cancellable:true})
      if(!order){
       order = await orderModel.create({
          userId: userId,
          items: [],
          totalPrice: 0,
          totalItems: 0,
          totalQuantity:0,
          status:status
        });
    }
      if(cancellable!=undefined){
        order.cancellable=cancellable
      }
      for (const item of items) {
        let existingItem = order.items.find(
          (existingItem) =>
            existingItem.productId.toString() === item.productId.toString()
        );
        if (existingItem) {
          // If the product already exists in the order, update the quantity
          existingItem.quantity += item.quantity;
        } else {
          // If the product doesn't exist in the order, add it as a new item
          order.items.push({
            productId: item.productId,
            quantity: item.quantity,
          });
        }
        // Update totalItems
        order.totalItems = order.items.length;
      }
      let totalQuantity=0;
      for(let count of order.items){
        totalQuantity+=count.quantity

      }
      order.totalQuantity=totalQuantity
      // Calculate the total price of the order based on the product prices
      order.totalPrice = TotalPrice(order.items, products);
  
      // Save the updated order
      await order.save();
  
      // Return the updated order document with product details
      const response = {
        _id: order._id,
        userId: order.userId,
        items: order.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        totalPrice: order.totalPrice,
        totalItems: order.totalItems,
        totalQuantity:order.totalQuantity,
        cancellable:order.cancellable,
        status:order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      };
      return res.status(201).send({status:true,message:"successful",data:response});
    } catch (error) {
      if (error.message.includes("validation")) {
        return res.status(400).send({ status: false, message: error.message });
      } else if (error.message.includes("duplicate")) {
        return res.status(400).send({ status: false, message: error.message });
      } else {
        return res.status(500).send({ status: false, message: error.message });
      }
    }
  };
  const updateOrder=async function(req,res){
    try {
        const userId=req.params.userId;
        const {orderId,status}= req.body;
     if(!orderId||!status){
        return res.status(400).send({status:false,message:"please enter required details"})
     }
    if(!userId){
        return res.status(404).send({status:false,message:"page not found"});
    }
    if(!valid.isValidObjectId(orderId)){
        return res.status(400).send({status:false,message:"Please enter valid order id"})
    }
    const user= await userModel.findOne({_id:userId});
    if(!user){
        return res.status(404).send({status:false,message:"user not found"})
    }
    const order=await orderModel.findOne({_id:orderId})
    if(!order){
        return res.status(404).send({status:false,message:"order is not found"})
    }
    if(order.cancellable==false){
        return res.status(403).send({status:false, message:"order can not be cancel"})
    }
    if(order.userId!=userId){
        return res.status(403).send({status:false,message:"you are not authorised to cancel order"})
    }
    if(status=='cancelled'){
    order.cancellable=false;
    order.status='cancelled';
    }else if(status=='pending'){
        order.status='pending';
    }else if(status=='completed'){
        order.status='completed'
        order.cancellable=false;
    }else{
        return res.status(400).send({status:false,message:"Please enter valid status"})
    }
    await order.save();
    const response = {
        _id: order._id,
        userId: order.userId,
        items: order.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        totalPrice: order.totalPrice,
        totalItems: order.totalItems,
        totalQuantity:order.totalQuantity,
        cancellable:order.cancellable,
        status:order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      };
      return res.status(200).send({status:true,message:"successful",data:response});

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
    }
module.exports= {createOrder,updateOrder}