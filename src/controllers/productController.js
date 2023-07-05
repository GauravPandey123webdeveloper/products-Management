const productModel = require('../models/productModel')
const { uploadImage } = require('../aws/aws')
const valid = require('../validations/valid')
const createProduct = async function (req, res) {
    try {
        const files = req.files
        const data = req.body
        const { title, description, price, currencyId, currencyFormat, installments } = req.body
        if (!title || !description || !price || !currencyId || !currencyFormat) {
            return res.status(400).send({ status: false, message: "Please Enter required fields" })
        }
        if (!valid.indianPrice(price)) {
            return res.status(400).send({ status: false, message: "Please enter valid price" })
        }
        if (currencyId != "INR") {
            return res.status(400).send({ status: false, message: "Please enter valid Currency ID , it can only be 'INR' " })
        }
        if (currencyFormat != '₹') {
            return res.status(400).send({ status: false, message: "Please enter valid Currency ID , it can only be 'INR' " })
        }
        if (files && files.length != 0) {
            let imgUrl = await uploadImage(files[0])
            data.productImage = imgUrl
        } else {
            return res.status(400).send({ status: false, message: "please insert the image" })
        }
        if (installments && !valid.indianPrice(installments)) {
            return res.status(400).send({ status: false, message: "Please enter valid installment amount" })
        }
        const product = await productModel.create(data)
        return res.status(201).send({ status: true, message: "success", data: product })
    } catch (error) {
        if (error.message.includes('validation')) {
            return res.status(400).send({ status: false, message: error.message })
        } 
        else if (error.message.includes('duplicate')) {
            return res.status(400).send({ status: false, message: error.message })
        }
        else {
            return res.status(500).send({ status: false, message: error.message })
        }
    }
}
const getProducts = async function (req, res) {
    try {
        const name = req.query.name;
        const size = req.query.size;
        const priceLessThan = req.query.priceLessThan;
        const priceGreaterThan = req.query.priceGreaterThan;
        const priceSort = req.query.priceSort;

        if (!name && !priceLessThan && !priceGreaterThan && !size) {
            const products = await productModel.find({ isDeleted: false }).sort({ price: priceSort });
            if (products.length == 0) {
                return res.status(404).send({ status: false, message: "No products are listed " })
            }
            return res.status(200).send({ status: true, message: "Products List", data: products });
        }

        let filter = {};

        if (name) {
            filter.title = { $regex: name, $options: "i" };
        }

        if (size) {
            filter.availableSizes = { $in: [size] };
        }

        if (priceLessThan || priceGreaterThan) {
            filter.price = {};
            if (priceLessThan) {
                filter.price.$lt = priceLessThan;
            }
            if (priceGreaterThan) {
                filter.price.$gt = priceGreaterThan;
            }
        }
        const products = await productModel.find({ isDeleted: false, ...filter })
            .sort({ price: priceSort });
        if (products.length == 0) {
            return res.status(404).send({ status: false, message: "No products are listed " })
        }
        return res.status(200).send({ status: true, message: "Products List", data: products });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}
const getProduct = async function (req, res) {
    try {
        const productId = req.params.productId
        if (!valid.isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "please enter valid product id" })
        }
        const products = await productModel.find({ _id: productId, isDeleted: false })
        if (products.length == 0) {
            return res.status(404).send({ status: false, message: "No products are listed " })
        }
        return res.status(200).send({ status: true, message: "Product description", data: products });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}
const updateProduct = async function (req, res) {
    try {
        const files = req.files
        const productId = req.params.productId
        if(!valid.isValidObjectId(productId)){
            return res.status(400).send({ status: false, message: "Please enter valid objectId" })
        }
        const { title, description, price, currencyId, currencyFormat, installments,size} = req.body
       
        if (price && !valid.indianPrice(price)) {
            return res.status(400).send({ status: false, message: "Please enter valid price" })
        }
        if (currencyId && currencyId != "INR") {
            return res.status(400).send({ status: false, message: "Please enter valid Currency ID , it can only be 'INR' " })
        }
        if (currencyFormat && currencyFormat != '₹') {
            return res.status(400).send({ status: false, message: "Please enter valid Currency ID , it can only be 'INR' " })
        }
        if (installments && !valid.indianPrice(installments)) {
            return res.status(400).send({ status: false, message: "Please enter valid installment amount" })
        }
        const updateData = {};

        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (price) updateData.price = price;
        if (currencyId) updateData.currencyId = currencyId;
        if (currencyFormat) updateData.currencyFormat = currencyFormat;
        if (installments) updateData.installments = installments;
        if (size&&!valid.sizesCheck(size)) {
           return res.status(400).send({status:false,message:`Please Enter the valid size from ["S", "XS", "M", "X", "L", "XXL", "XL"]`})
          }        
        if (files && files.length != 0) {
            let imgUrl = await uploadImage(files[0])
            updateData.productImage = imgUrl
        }
        if (Object.keys(updateData).length === 0) {
            return res
                .status(400)
                .send({ status: false, message: "No valid update data provided" });
        }

        const product = await productModel.findOneAndUpdate(
            { isDeleted: false, _id: productId },
            { $set: updateData,$push:{availableSizes:size} },
            { new: true }
        );

        if (!product) {
            return res
                .status(404)
                .send({ status: false, message: "Product not found" });
        }

        return res.status(200).send({ status: true, message: "success", data: product });
    } catch (error) {
        if (error.message.includes('validation')) {
            return res.status(400).send({ status: false, message: error.message })
        }
        else if (error.message.includes('duplicate')) {
            return res.status(400).send({ status: false, message: error.message })
        }
        else {
            return res.status(500).send({ status: false, message: error.message })
        }
    }
}
const deleteProduct= async function(req,res){
    try {
        const productId=req.params.productId
        if(!valid.isValidObjectId(productId)){
            return res.status(400).send({status:false,message:"Please provide valid productId"})
        }
        const product= await productModel.findOneAndUpdate({_id:productId,isDeleted:false},{$set:{isDeleted:true,deletedAt:Date.now()}},{new:true})
        if(!product){
            return res.status(404).send({status:false,message:"Data not found to be deleted "})
        }
        return res.status(200).send({status:true,message:"Deleted successfuly",data:product })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}
module.exports = { createProduct, getProducts, getProduct, updateProduct,deleteProduct}