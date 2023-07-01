const express= require('express')
const router= express.Router()
const user=require('../controllers/userController')
const {authentication,authorization}=require('../authentication/auth')
router.post('/register', user.createUser)
router.post('/login',user.login)  
router.get('/user/:userId/profile',authentication,user.getUser)
router.put('/user/:userId/profile',authentication,authorization,user.updateUser)
module.exports=router