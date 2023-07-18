const Book = require('../models/Book')
const fs = require('fs')
const sharp = require('sharp')
const path = require('path')
const { error } = require('console')
/**
 * desc : Returns all books
 * route : GET /api/books
 * access : public
 * @param {*} req
 * @param {*} res
 */
async function getBooks(_, res, _) {
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
   const { userId, ratings, averageRating, ...bookObject } = JSON.parse(req.body.book)

   const book = new Book({
      ...bookObject,
      userId: req.user._id,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.originalname}`,
      ratings: [],
      averageRating: 0,
   })
   try {
      console.log(book)
      await sharp(req.file.buffer).resize(400).toFile(`./images/${req.file.originalname}`)
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
async function updateBook(req, res, _) {
   const book = await Book.findOne({ _id: req.params.id })
   const oldFilename = book.imageUrl.split('/images/')[1]
   if (req.file) {
      fs.unlink(`images/${oldFilename}`, (error) => {
         if (error) throw error
      })
   }

   const bookObject = req.file
      ? {
           ...JSON.parse(req.body.book),
           imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.originalname}`,
        }
      : { ...req.body }
   delete bookObject.userId

   if (book.userId != req.user._id) {
      return res.status(403).json({ message: 'Requête non autorisée' })
   }

   try {
      if (bookObject.imageUrl) {
         await sharp(req.file.buffer).resize(400).toFile(`./images/${req.file.originalname}`)
      }
      await Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })

      return res.status(200).json({ message: 'Livre modifié avec succès !' })
   } catch (error) {
      return res.status(401).json({ error })
   }
}

/**
 * desc : Deletes single book
 * route : DELETE /api/books/:id
 * access : private
 * @param {*} req
 * @param {*} res
 */
async function deleteBook(req, res) {
   try {
      const book = await Book.findOne({ _id: req.params.id })

      if (!book) {
         return res.status(404).json({ message: "Ce livre n'existe pas" })
      }

      if (book.userId != req.user._id) {
         return res.status(403).json({ message: 'Requête non autorisée' })
      }

      const filename = book.imageUrl.split('/images/')[1]

      return fs.unlink(`images/${filename}`, async () => {
         await book.deleteOne()
         res.status(200).json({ message: 'Livre supprimé !' })
      })
   } catch (error) {
      return res.status(400).json({ error })
   }
}
/**
 * desc : Sets user rating for book matching id
 * route : POST /api/books/:id/rating
 * access : private
 * @param {*} req
 * @param {*} res
 */
async function setBookRating(req, res, _) {
   try {
      const book = await Book.findOne({ _id: req.params.id })

      if (!book) return

      const oldRating = book.ratings.find((rating) => rating.userId === req.user._id)

      if (oldRating) {
         return res.status(400).json({ message: 'Note déjà présente pour cet utilisateur' })
      }

      book.ratings.push({
         userId: req.user._id,
         grade: req.body.rating,
      })

      const totalRatings = book.ratings.length
      const sumRatings = book.ratings.reduce((sum, rating) => sum + rating.grade, 0)

      book.averageRating = Math.round(sumRatings / totalRatings)

      await book.save()
      return res.status(200).json(book)
   } catch (error) {
      return res.status(400).json({ error })
   }
}

/**
 * desc : Returns array of 3 books with highest average rating
 * route : GET /api/books/bestrating
 * access : public
 * @param {*} req
 * @param {*} res
 */
async function getHighestRatedBooks(_, res, _) {
   try {
      const bestBooks = await Book.find().sort({ averageRating: 'desc' }).limit(3)

      if (bestBooks) {
         return res.status(200).json(bestBooks)
      }
      return res.status(404).json({ error })
   } catch (error) {
      return res.status(500).json({ error })
   }
}

module.exports = {
   getBooks,
   getBookById,
   newBook,
   updateBook,
   deleteBook,
   setBookRating,
   getHighestRatedBooks,
}
