const user = require('../../../../models/user/userregistration');

const bcrypt = require('bcrypt');

const jwtData = require('jsonwebtoken');

const fs = require('fs');

const path = require('path');

// user insert data
module.exports.add_user = async (req, res) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        var userImage = '';
        if (req.file) {
            userImage = user.imageuserpath + '/' + req.file.filename;
        }
        req.body.user_image = userImage;
        let userData = await user.create(req.body);
        if (userData) {
            return res.status(200).json({ message: 'User Data Susscefully Inserted..', status: 0, userData: userData });
        }
        else {
            return res.status(200).json({ message: 'User Data Not Inserted..', status: 0 });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'Somthing Wrong', status: 0 });
    }
}

// user login
module.exports.login = async (req, res) => {
    // console.log(req.body);
    try {

        let checkEmail = await user.findOne({ email: req.body.email });
        if (checkEmail) {
            if (await bcrypt.compare(req.body.password, checkEmail.password)) {
                let token = jwtData.sign({ userData: checkEmail }, 'user', { expiresIn: '1h' });
                if (token) {
                    return res.status(200).json({ message: 'Login Susscesfully', status: 1, token: token });
                }
            }
        }
        else {
            return res.status(400).json({ message: 'Invaild Login..', status: 0 });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'Somthing Wrong..', status: 0 });
    }
}

// user profile
module.exports.profile = async (req, res) => {
    // let userData = await user.findById(req.user.id);
    try {
        if (req.user) {
            return res.status(200).json({ message: 'User Profile is Here...', status: 1, user_Profile: req.user });
        }
        else {
            return res.status(200).json({ message: 'User Profile Is Found', status: 0 });
        }

    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'Somthing Wrong...', status: 0 });
    }
}

// user rdit profile
module.exports.edit_profile = async(req,res)=>{
    try {
        let oldUserData = await user.findById(req.query.id);
        if (req.file) {
            var fullpath = path.join(__dirname, '../../../..', oldUserData.user_image);
            try{
                await fs.unlinkSync(fullpath);
            }
            catch(err){
                console.log(err);
            }

            req.body.user_image = user.userImagePath + '/' + req.file.filename;
            var update = await user.findByIdAndUpdate(req.query.id, req.body);
            if (update) {
                return res.status(200).json({ message: 'User Data Susscesfully Update...', status: 1 })
            }
            else {
                return res.status(200).json({ message: 'User Data Not Update..', status: 0 })
            }
        }
        else {
            var imagePath = '';
            if (oldUserData) {
                imagePath = oldUserData.user_image;
            }
            req.body.user_image = oldUserData.user_image;
            var update = await user.findByIdAndUpate(req.query.id, req.body);
            if (update) {
                return res.status(200).json({ message: 'Manager Data Susscesfully Update...', status: 1 })
            }
            else {
                returnres.status(200).json({ message: 'Manager Data Not Update..', status: 0 })
            }
        }

    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'Somthing Wrong...', status: 0 });
    }
}

// view user Data
module.exports.view_user = async (req, res) => {
    try {
        var AllUserData = await user.find({});
        if (AllUserData) {
            return res.status(200).json({ message: 'User All Data Here...', status: 1, AllUserData: AllUserData });
        }
        else {
            return res.status(200).json({ message: 'Uff... User Data Not Here..', status: 0 });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'Somthing Wrong..', status: 0 });
    }
}
