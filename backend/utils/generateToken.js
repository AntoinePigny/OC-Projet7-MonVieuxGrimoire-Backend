require('dotenv').config()
const jwt = require('jsonwebtoken')

function generateToken(userId) {
   const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: `${process.env.JWT_EXPIRES_IN}d`,
   })
   return token
}

module.exports = generateToken
