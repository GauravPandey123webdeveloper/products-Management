const userModel = require('../models/userModel')
const valid = require('../validations/valid')
const { uploadImage } = require('../aws/aws');
const bcrypt = require('bcrypt');
const { secretLoginKey } = require('../../config');
const jwt= require('jsonwebtoken')
const createUser = async function (req, res) {
    try {
        const files = req.files;
        const data = req.body;
        const address = JSON.parse(req.body.address);
        const { fname, lname, email, phone, password } = data
        const { shipping, billing } = address;
        if (!valid.isValidData(fname)) {
            return res.status(400).send({ status: false, message: "please enter first name correctly" })
        }
        if (!valid.isValidData(lname)) {
            return res.status(400).send({ status: false, message: "please enter last name correctly" })
        }
        if (!valid.validEmail(email)) {
            return res.status(400).send({ status: false, message: "please enter email correctly" })
        }
        if (!valid.validMobile(phone)) {
            return res.status(400).send({ status: false, message: "please enter Phone number correctly" })
        }
        if (!valid.validPassword(password)) {
            return res.status(400).send({ status: false, message: "please enter password correctly" })
        }
        const check = await userModel.findOne({ email: email })
        if (check) {
            return res.status(400).send({ status: false, message: "this email already exists" })
        }
        if (files && files.length > 0) {
            var imgUrl = await uploadImage(files[0])
        } else {
            return res.status(400).send({ status: false, message: "please insert image" })
        }
    
        const salt = await bcrypt.genSalt();
        const pass = await bcrypt.hash(password, salt);
        const user = await userModel.create({ fname, lname, email, phone, password: pass, profileImage: imgUrl, address: { shipping, billing } })
        return res.status(201).send({ status: true, message: "successful", data: user })

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
const login= async function(req,res){
    try {
        const {email,password}=req.body
        if (!valid.validEmail(email)) {
            return res.status(400).send({ status: false, message: "please enter email correctly" })
        }
        if(!password){
            return res.status(400).send({ status: false, message: "please enter your password" }) 
        }
        const userData= await userModel.findOne({email:email})
        if(!userData){
            return res.status(400).send({status:false,message:"please enter correct email"})
        }
        const passwordMatch = await bcrypt.compare(password, userData.password);
        if (!passwordMatch) {
          return res.status(400).send({ status: false, message: 'Please enter the correct password' });
        }
        let token =jwt.sign({id:userData._id.toString()},secretLoginKey,{expiresIn:'24h'})
        if(!token){
            return res.status(500).send({status:false,message:"try again ..."})
        }
        res.setHeader('x-api-key',token)
        return res.status(200).send({status:true,message:"user login successfuly",data:{userId:userData._id,token:token}})
        
        
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}
module.exports = {createUser,login}