const express = require('express')
const path = require('path')
const userRouter = require('./routes/userRoutes')
const productRouter = require('./routes/productRoutes')
const app = express()

app.use(express.json())


app.use('/test3/user', userRouter)
app.use('/product', productRouter)

module.exports = app;