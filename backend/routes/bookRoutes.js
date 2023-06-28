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
const multerConfig = require('../middleware/multerConfig')

const router = express.Router()

router.route('/').get(getBooks).post(protect, multerConfig, asyncHandler(newBook))
router.get('/bestrating', asyncHandler(getHighestRatedBooks))
router
   .route('/:id')
   .get(getBookById)
   .put(protect, multerConfig, asyncHandler(updateBook))
   .delete(protect, asyncHandler(deleteBook))
//.post('/rating', protect, asyncHandler(setBookRating))

module.exports = router
