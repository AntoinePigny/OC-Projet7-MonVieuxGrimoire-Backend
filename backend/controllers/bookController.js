const Book = require('../models/Book')

/**
 * desc : Returns all books
 * route : GET /api/books
 * access : public
 * @param {*} req
 * @param {*} res
 */
async function getBooks(req, res, next) {
   const books = await Book.find()

   if (books) {
      res.status(200).json(books)
   } else {
      res.status(404)
      throw new Error('Aucun livre dans la Base de données')
   }
}

/**
 * desc : Posts new book to db
 * route : POST /api/books
 * access : private
 * @param {*} req
 * @param {*} res
 */
async function newBook(req, res) {
   delete req.body._id
   const book = new Book({
      ...req.body,
   })
   try {
      await book.save()
      res.status(201).json({ message: 'Livre enregistré !' })
   } catch (error) {
      res.status(400).json({ error })
   }
}

/**
 * desc : Returns book matching given id
 * route : GET /api/books/:id
 * access : public
 * @param {*} req
 * @param {*} res
 */
async function getBookById(req, res) {
   const book = await Book.findOne({ _id: req.params.id })

   if (book) {
      res.status(200).json(book)
   } else {
      res.status(404)
      throw new Error("Ce livre n'est pas dans la base de données")
   }
}

/**
 * desc : Updates book's data matching id
 * route : PUT /api/books/:id
 * access : private
 * @param {*} req
 * @param {*} res
 */
async function updateBook(params) {}

/**
 * desc : Deletes single book
 * route : DELETE /api/books/:id
 * access : private
 * @param {*} req
 * @param {*} res
 */
async function deleteBook(req, res) {
   try {
      await Book.deleteOne({ _id: req.params.id })
      res.status(200).json({ message: 'Livre supprimé !' })
   } catch (error) {
      res.status(400).json({ error })
   }
}

/**
 * desc : Sets user rating for book matching id
 * route : POST /api/books/:id/rating
 * access : private
 * @param {*} req
 * @param {*} res
 */
async function setBookRating(params) {}

/**
 * desc : Returns array of 3 books with highest average rating
 * route : GET /api/books/bestrating
 * access : public
 * @param {*} req
 * @param {*} res
 */
async function getHighestRatedBooks(params) {}

module.exports = {
   getBooks,
   getBookById,
   newBook,
   updateBook,
   deleteBook,
   setBookRating,
   getHighestRatedBooks,
}
