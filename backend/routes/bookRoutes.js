const express = require('express')
const asyncHandler = require('express-async-handler')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()
const asyncProtect = asyncHandler(protect)

router.route('/').get().post(asyncProtect)
router.route('/:id').get().put(asyncProtect).delete(asyncProtect).post('/rating', asyncProtect)
router.get('/bestrating')

module.exports = router
