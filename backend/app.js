const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/userRoutes')
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

app.get('/api/books', (req, res, next) => {
   const stuff = [
      {
         _id: 'oeihfzeoi',
         title: 'Mon premier objet',
         description: 'Les infos de mon premier objet',
         imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
         price: 4900,
         userId: 'qsomihvqios',
      },
      {
         _id: 'oeihfzeomoihi',
         title: 'Mon deuxième objet',
         description: 'Les infos de mon deuxième objet',
         imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
         price: 2900,
         userId: 'qsomihvqios',
      },
   ]
   res.status(200).json(stuff)
})

app.post('/api/books', (req, res, next) => {
   console.log(req.body)
   res.status(201).json({
      message: 'Objet créé !',
   })
})

app.use(notFound)
app.use(errorHandler)

module.exports = app
