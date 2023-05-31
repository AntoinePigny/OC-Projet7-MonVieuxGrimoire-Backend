/**
 * desc : Auth user / set token
 * route : POST /api/auth/login
 * access : public
 * @param {*} req
 * @param {*} res
 */
function loginUser(req, res) {
   res.status(200).json({ message: 'Auth user' })
}

module.exports = {loginUser}
