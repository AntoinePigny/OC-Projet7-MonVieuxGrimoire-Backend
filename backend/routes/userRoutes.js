const express = require('express')
const { loginUser, registerUser } = require('../controllers/userController')
const asyncHandler = require('express-async-handler')

const router = express.Router()

router.post('/login', asyncHandler(loginUser))
router.post('/signup', asyncHandler(registerUser))

module.exports = router
