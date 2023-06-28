const multer = require('multer')

const MIME_TYPES = {
   'image/jpg': 'jpg',
   'image/jpeg': 'jpg',
   'image/png': 'png',
}

const storage = multer.memoryStorage()

function filter(req, file, cb) {
   if (file.mimetype.split('/')[0] === 'image') {
      cb(null, true)
   } else {
      cb(new Error('Only images are allowed!'))
   }
}

/* const storageAlt = multer.diskStorage({
   destination: (req, file, callback) => {
      callback(null, 'images')
   },
   filename: (req, file, callback) => {
      const name = file.originalname.split(' ').join('_')
      const extension = MIME_TYPES[file.mimetype]
      callback(null, name + Date.now() + '.' + extension)
   },
})
 */
const multerConfig = multer({ storage: storage, fileFilter: filter }).single('image')

module.exports = multerConfig
