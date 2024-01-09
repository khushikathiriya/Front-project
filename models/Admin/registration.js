const mongoose = require('mongoose');

const registraImagePath = '/uploads/Admin';

const path = require('path');

const multer = require('multer');

const RegistraSchema = mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    image: {
        type: String
    },
    managerIds: {
        type: Array,
        ref: 'Manager'
    }
});

const registrastorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../..', registraImagePath));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    }
});

RegistraSchema.statics.uploadregistraimage = multer({ storage: registrastorage }).single('image');
RegistraSchema.statics.imageregistrapath = registraImagePath;

const Registra = mongoose.model('Registra', RegistraSchema);

module.exports = Registra;