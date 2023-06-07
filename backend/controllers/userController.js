const generateToken = require('../utils/generateToken')
const User = require('../models/User')

/**
 * desc : Auth user / set token
 * route : POST /api/auth/login
 * access : public
 * @param {*} req
 * @param {*} res
 */
async function loginUser(req, res) {
   const { email, password } = req.body

   const user = await User.findOne({ email })

   if (user && (await user.matchPasswords(password))) {
      generateToken(res, user._id)
      res.status(201).json({
         _id: user._id,
         email: user.email,
      })
   } else {
      res.status(401)
      throw new Error('Email/Mot de passe invalide')
   }
}
/**
 * desc : Register new user
 * route : POST /api/auth/signup
 * access : public
 * @param {*} req
 * @param {*} res
 */
async function registerUser(req, res) {
   const { email, password } = req.body
   const userExists = await User.findOne({ email })

   if (userExists) {
      res.status(400)
      throw new Error(`L'utilisateur existe déjà`)
   }

   const user = await User.create({
      email,
      password,
   })

   if (user) {
      generateToken(res, user._id)
      res.status(201).json({
         _id: user._id,
         email: user.email,
      })
   } else {
      res.status(400)
      throw new Error('Données utilisateur invalides')
   }
}

module.exports = { loginUser, registerUser }
