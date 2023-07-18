const multer = require('multer')

const storage = multer.memoryStorage()

function filter(_, file, cb) {
   if (file.mimetype.split('/')[0] === 'image') {
      cb(null, true)
   } else {
      cb(new Error('Only images are allowed!'))
   }
}

const multerBuffer = multer({ storage: storage, fileFilter: filter }).single('image')

module.exports = multerBuffer
