const multer = require('multer');
const { uploadFile } = require('./path/to/uploadFile');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../uploads'); 
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original file name
  }
});


const upload = multer({ storage });

module.exports = {
    upload 
}
