const uuid = require('uuid') ;
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb) => {
        cb(null, uuid() + path.extname(file.originalname));
    }
})

const uploadFile = multer({
    storage: storage,
    limits: { fileSize: 1000000 }
}).single('image');

module.exports = uploadFile;
