const mongoose = require('mongoose');

const userImagePath = '/uploads/user';

const path = require('path');

const multer = require('multer');

const userSchema = mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    user_image: {
        type: String
    }
});

const userstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../..', userImagePath));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    }
});

userSchema.statics.uploaduserimage = multer({ storage: userstorage }).single('user_image');
userSchema.statics.imageuserpath = userImagePath;


const User = mongoose.model('User', userSchema);

module.exports = User;