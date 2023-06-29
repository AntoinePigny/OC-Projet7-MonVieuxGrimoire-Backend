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
const multerBuffer = require('../middleware/multerConfig')

const router = express.Router()

router.route('/').get(getBooks).post(protect, multerBuffer, asyncHandler(newBook))
router.get('/bestrating', asyncHandler(getHighestRatedBooks))
router.post('/:id/rating', protect, asyncHandler(setBookRating))
router
   .route('/:id')
   .get(getBookById)
   .put(protect, multerBuffer, asyncHandler(updateBook))
   .delete(protect, asyncHandler(deleteBook))

module.exports = router
