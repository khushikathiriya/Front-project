const regisrter = require('../../../../models/Admin/registration');

const bcrypt = require('bcrypt');

const jwtData = require('jsonwebtoken');

const fs = require('fs');

const path = require('path');

// insert registration admin data
module.exports.Registration = async (req, res) => {
 
    console.log(req.file);
    console.log(req.body);
    try {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        var adminImage = '';
        if (req.file) {
            adminImage = regisrter.imageregistrapath + '/' + req.file.filename;
        }
        req.body.image = adminImage;
        let adminData = await regisrter.create(req.body);
        if (adminData) {
            return res.status(200).json({ message: 'Admin Data Susscefully Inserted..', status: 0, adminData: adminData });
        }
        else {
            return res.status(200).json({ message: 'Admin Data Not Inserted..', status: 0 });
        }

    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'Somthing Wrong..', status: 0 });
    }
}

// admin login with token
module.exports.login = async (req, res) => {
    // console.log(req.body);
    try {

        let checkEmail = await regisrter.findOne({ email: req.body.email });
        if (checkEmail) {
            if (await bcrypt.compare(req.body.password, checkEmail.password)) {
                let token = jwtData.sign({ userData: checkEmail }, 'admin', { expiresIn: '1h' });
                if (token) {
                    return res.status(200).json({ message: 'Login Susscesfully', status: 1, token: token });
                }
            }
        }
        else{
            return res.status(400).json({ message: 'Record not found Wrong..', status: 0 });
        }
    }
    catch (err) {
        return res.status(400).json({ message: 'Somthing Wrong..', status: 0 });
    }
}

// admin view all data
module.exports.view_admin_data = async (req, res) => {
    try {
        var AllAdminData = await regisrter.find({});
        if (AllAdminData) {
            return res.status(200).json({ message: 'Admin All Data Here...', status: 1, AllAdminData: AllAdminData });
        }
        else {
            return res.status(200).json({ message: 'Uff... Admin Data Not Here..', status: 0 });
        }
    }
    catch (err) {
        return res.status(400).json({ message: 'Somthing Wrong..', status: 0 });
    }
}

// admin profile 
module.exports.profile = async (req, res) => {
    try {
        // console.log(req.user);
        let adminData = await regisrter.findById(req.user.id).populate('managerIds').exec();
        if (adminData) {
            return res.status(200).json({ message: 'Admin Profile is Here...', status: 1, Admin_Profile: adminData });
        }
        else{
            return res.status(200).json({message:'Admin Profile Is Found',status:0});
        }

    }
    catch (err) {
        return res.status(400).json({ message: 'Somthing Wrong..', status: 0 });
    }
}
// admin profile edit
module.exports.profileEdit = async (req, res) => {
    // console.log(req.query.id);
    // console.log(req.body);
    // console.log(req.file);

    try {
        let oldAdminData = await regisrter.findById(req.query.id);
        if (req.file) {
            var fullpath = path.join(__dirname, '../../../..', oldAdminData.image);
            // console.log(fullpath)    
            try{
                await fs.unlinkSync(fullpath);
            }
            catch(err){
                console.log();
            }

            req.body.image = regisrter.imageregistrapath + '/' + req.file.filename;
            var update = await regisrter.findByIdAndUpdate(req.query.id, req.body);
            if (update) {
                return res.status(200).json({ message: 'Admin Data Susscesfully Update...', status: 1 })
            }
            else {
                return res.status(200).json({ message: 'Admin Data Not Update..', status: 0 })
            }
        }
        else {
            var imagePath = '';
            if (oldAdminData) {
                imagePath = oldAdminData.image;
            }
            req.body.image = oldAdminData.image;
            var update = await regisrter.findByIdAndUpate(req.query.id, req.body);
            if (update) {
                return res.status(200).json({ message: 'Admin Data Susscesfully Update...', status: 1 })
            }
            else {
                returnres.status(200).json({ message: 'Admin Data Not Update..', status: 0 })
            }
        }

    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'Somthing Wrong...', status: 0 });
    }
}

