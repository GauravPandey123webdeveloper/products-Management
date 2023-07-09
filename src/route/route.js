const express= require('express')
const router= express.Router()
const user=require('../controllers/userController')
const product=require('../controllers/productController')
const cart=require('../controllers/cartController')
const order=require('../controllers/orderController')
const {authentication,authorization}=require('../authentication/auth')
router.post('/register', user.createUser)
router.post('/login',user.login)  
router.get('/user/:userId/profile',authentication,user.getUser)
router.put('/user/:userId/profile',authentication,authorization,user.updateUser)
router.post('/products',product.createProduct)
router.get('/products',product.getProducts)
router.get('/products/:productId',product.getProduct)
router.put('/products/:productId',product.updateProduct)
router.delete('/products/:productId',product.deleteProduct)
router.post('/users/:userId/cart',authentication,authorization,cart.createCart)
router.put('/users/:userId/cart',authentication,authorization,cart.updateCart)
router.get('/users/:userId/cart',authentication,authorization,cart.getCart)
router.delete('/users/:userId/cart',authentication,authorization,cart.deleteCart)
router.post('/users/:userId/orders',authentication,authorization,order.createOrder)
router.put('/users/:userId/orders',authentication,authorization,order.updateOrder)
module.exports=router