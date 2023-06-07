require('dotenv').config()
const jwt = require('jsonwebtoken')

function generateToken(res, userId) {
   const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: `${process.env.JWT_EXPIRES_IN}d`,
   })

   res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: process.env.JWT_EXPIRES_IN * 86400000, //converting days in seconds
   })
}

module.exports = generateToken
