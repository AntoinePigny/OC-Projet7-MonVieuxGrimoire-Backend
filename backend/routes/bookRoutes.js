const express = require('express')
const asyncHandler = require('express-async-handler')
const { protect } = require('../middleware/authMiddleware')
const {
   getBooks,
   getBookById,
   deleteBook,
   newBook,
   updateBook,
   setBookRating,
   getHighestRatedBooks,
} = require('../controllers/bookController')

const router = express.Router()

router.route('/').get(getBooks).post(protect, asyncHandler(newBook))
router.route('/:id').get(getBookById).put(protect, asyncHandler(updateBook)).delete(protect, asyncHandler(deleteBook))
//.post('/rating', protect, asyncHandler(setBookRating))
router.get('/bestrating', getHighestRatedBooks)

module.exports = router
