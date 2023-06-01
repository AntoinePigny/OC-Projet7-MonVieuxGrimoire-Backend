const asyncHandler = require('express-async-handler')

/**
 * desc : Auth user / set token
 * route : POST /api/auth/login
 * access : public
 * @param {*} req
 * @param {*} res
 */
async function loginUser(req, res) {
   res.status(200).json({ message: 'Auth user' })
}
/**
 * desc : Register new user
 * route : POST /api/auth/signup
 * access : public
 * @param {*} req
 * @param {*} res
 */
async function registerUser(req, res) {
   res.status(200).json({ message: 'Register user' })
}

module.exports = { loginUser, registerUser }
