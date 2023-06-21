const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/userRoutes')
const bookRoutes = require('./routes/bookRoutes')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const cookieParser = require('cookie-parser')

connectDB()
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())

app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*')
   res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
   )
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
   next()
})
app.use('/api/auth', userRoutes)

app.use('/api/books', bookRoutes)

app.post('/api/books', (req, res, next) => {
   console.log(req.body)
   res.status(201).json({
      message: 'Objet créé !',
   })
})

app.use(notFound)
app.use(errorHandler)

module.exports = app
