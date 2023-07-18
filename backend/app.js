const express = require('express')
const userRoutes = require('./routes/userRoutes')
const bookRoutes = require('./routes/bookRoutes')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const path = require('path')
const expressMongoSanitize = require('express-mongo-sanitize')
const rateLimit = require('express-rate-limit')

connectDB()
const app = express()
const limiter = rateLimit({
   windowMs: 15 * 60 * 1000,
   max: 100,
   standardHeaders: true,
   legacyHeaders: false,
})
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
   expressMongoSanitize({
      allowDots: true,
      replaceWith: '_',
   })
)
app.use(limiter)

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
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use(notFound)
app.use(errorHandler)

module.exports = app
