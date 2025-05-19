const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/product_images'));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const tempFileName = `${Date.now()}${ext}`;
        cb(null, tempFileName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de arquivo não permitido!'), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;