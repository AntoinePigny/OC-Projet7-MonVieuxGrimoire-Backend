const jwt = require('jsonwebtoken')
const User = require('../models/User')

async function protect(req, res, next) {
   let token

   token = req.body.token
   if (token) {
      try {
         const decoded = jwt.verify(token, process.env.JWT_SECRET)

         req.user = await User.findById(decoded.userId).select('-password')

         next()
      } catch (error) {
         res.status(401)
         throw new Error('Non authorisé, token invalide')
      }
   } else {
      res.status(401)
      throw new Error('Non authorisé, token introuvable')
   }
}

module.exports = { protect }
