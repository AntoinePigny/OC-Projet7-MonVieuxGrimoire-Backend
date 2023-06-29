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
   const bookObject = JSON.parse(req.body.book)
   delete bookObject.userId
   delete bookObject.averageRating
   const initialAverageRating = bookObject.ratings[0].grade
   const book = new Book({
      ...bookObject,
      userId: req.user._id,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.originalname}`,
      averageRating: initialAverageRating,
   })
   try {
      try {
         await sharp(req.file.buffer).resize(400).toFile(`./images/${req.file.originalname}`)
      } catch (error) {
         console.log(error, 'Error Sharp')
      }
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
async function updateBook(req, res, next) {
   const bookObject = req.file
      ? {
           ...JSON.parse(req.body.book),
           imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.originalname}`,
        }
      : { ...req.body }
   delete bookObject.userId
   const book = await Book.findOne({ _id: req.params.id })
   try {
      try {
         if (book.userId != req.user._id) {
            res.status(403).json({ message: 'Requête non autorisée' })
         } else {
            try {
               await sharp(req.file.buffer).resize(400).toFile(`./images/${req.file.originalname}`)
            } catch (error) {
               console.log(error, 'Error Sharp')
            }
            await Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
            res.status(200).json({ message: 'Livre modifié avec succès !' })
         }
      } catch (error) {
         res.status(401).json({ error })
      }
   } catch (error) {
      res.status(400).json({ error })
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

      if (book && book.userId == req.user._id) {
         const filename = book.imageUrl.split('/images/')[1]
         fs.unlink(`images/${filename}`, async () => {
            await book.deleteOne()
            res.status(200).json({ message: 'Livre supprimé !' })
         })
      } else if (!book) {
         res.status(400).json({ message: "Ce livre n'existe pas" })
      } else {
         res.status(403).json({ message: 'Requête non autorisée' })
      }
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
async function setBookRating(req, res, next) {
   try {
      const book = await Book.findOne({ _id: req.params.id })

      if (!book) return

      const oldRating = await book.ratings.find((rating) => rating.userId === req.user._id)

      if (oldRating) {
         return res.status(400).json({ message: 'Note déjà présente pour cet utilisateur' })
      } else {
         await book.ratings.push({
            userId: req.user._id,
            grade: req.body.rating,
         })
      }

      const totalRatings = await book.ratings.length
      const sumRatings = await book.ratings.reduce((sum, rating) => sum + rating.grade, 0)
      const averageRating = Math.round(sumRatings / totalRatings)
      book.averageRating = averageRating

      try {
         await book.save()
         res.status(200).json(book)
      } catch (error) {
         res.status(400).json({ error })
      }
   } catch (error) {
      res.status(400).json({ error })
   }
}

/**
 * desc : Returns array of 3 books with highest average rating
 * route : GET /api/books/bestrating
 * access : public
 * @param {*} req
 * @param {*} res
 */
async function getHighestRatedBooks(req, res, next) {
   try {
      const bestBooks = await Book.find().sort({ averageRating: 'desc' }).limit(3)
      if (bestBooks) res.status(200).json(bestBooks)
   } catch (error) {
      res.status(404).json({ error })
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
