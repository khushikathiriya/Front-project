const mongoose = require('mongoose');

const managerImagePath = '/uploads/manager';

const path = require('path');

const multer = require('multer');

const managerSchema = mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    managerimage: {
        type: String
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Registra',
        required: true
    }
});

const managerstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../..', managerImagePath));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    }
});

managerSchema.statics.uploadmanagerimage = multer({ storage: managerstorage }).single('managerimage');
managerSchema.statics.imagemanagerpath = managerImagePath;


const Manager = mongoose.model('Manager', managerSchema);

module.exports = Manager;