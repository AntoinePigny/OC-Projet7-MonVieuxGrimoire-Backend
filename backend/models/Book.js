const mongoose = require('mongoose')

const bookSchema = mongoose.Schema({
   userId: { type: String, required: true },
   title: { type: String, required: true },
   author: { type: String, required: true },
   imageUrl: { type: String, required: true },
   year: { type: Number, required: true },
   genre: { type: String, required: true },
   ratings: [
      {
         userId: { type: String, required: true },
         grade: { type: Number, min: [0, 'Pas de nombre négatif'], max: [5, 'Note trop grande'], required: true },
      },
   ],
   averageRating: { type: Number, min: [0, 'Pas de nombre négatif'], max: [5, 'Moyenne trop grande'], required: true },
})

const Book = mongoose.model('Book', bookSchema)
module.exports = Book
