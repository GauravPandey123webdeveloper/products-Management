const express = require('express')
const mongoose = require('mongoose')
const multer= require('multer')
const route = require('./route/route')
const {mongodb,PORT}=require('../config')
require('dotenv').config()
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(multer().any())
mongoose.connect(mongodb, { useNewUrlParser: true }).then(() => {
    console.log("mongodb has connected")}).catch((err) => {
        console.log(err.message)
    })
app.use('/', route)
app.listen(PORT || 8080, () => {
    console.log("server has started on the port :",PORT || 8080)
})
