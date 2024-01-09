const nodemailer = require('nodemailer');

const manager = require('../../../../models/manager/managerregistration');

const regisrter = require('../../../../models/Admin/registration');

const fs = require('fs');

const path = require('path');

const bcrypt = require('bcrypt');

const jwtData = require('jsonwebtoken');

// add manager data
module.exports.add_manager = async (req, res) => {
    // console.log(req.body);
    // console.log(req.file);
    try {
        let checkEmail = await manager.findOne({ email: req.body.email })
        if (checkEmail) {

            return res.status(200).json({ message: 'Email Allready exice....', status: 1 });
        }
        else {
            if (req.body.password = req.body.confirm_password) {
                const transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true,
                    auth: {
                        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                        user: "khushikathiriyak@gmail.com",
                        pass: "qpjjwnxiprqhkxey",
                    },
                });

                const info = await transporter.sendMail({
                    from: 'khushikathiriyak@gmail.com', // sender address
                    to: req.body.email, // list of receivers
                    subject: "Email Password", // Subject line
                    text: "Login Password", // plain text body
                    html: `<b>Email:${req.body.email}</b><br><b>Password:${req.body.password}</b>`, // html body
                });
                // how many manager add  - [id] by admin
                req.body.adminId = req.user.id
                req.body.password = await bcrypt.hash(req.body.password, 10);
                var managerImage = '';
                if (req.file) {
                    managerImage = manager.imagemanagerpath + '/' + req.file.filename;
                }
                req.body.managerimage = managerImage;
                let managerData = await manager.create(req.body);
                if (managerData) {
                    // admin in push manager Ids
                    let reg = await regisrter.findById(req.user.id);
                    reg.managerIds.push(managerData.id);
                    await regisrter.findByIdAndUpdate(req.user.id, reg);

                    return res.status(200).json({ message: 'Manager Data Susscefully Inserted..', status: 1, managerData: managerData });
                }
                else {
                    return res.status(200).json({ message: 'Manager Data Not Inserted..', status: 0 });
                }
            }
            else {
                return res.status(200).json({ message: 'Password not a Match...', status: 0 });
            }
        }

    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'Somthing Worng...', status: 0 })
    }
}

// managar login
module.exports.login = async (req, res) => {
    // console.log(req.body);
    try {
        let checkEmail = await manager.findOne({ email: req.body.email });
        if (checkEmail) {
            if (await bcrypt.compare(req.body.password, checkEmail.password)) {
                let token = jwtData.sign({ managerData: checkEmail }, 'manager', { expiresIn: '1h' });
                if (token) {
                    return res.status(200).json({ message: 'Login Susscesfully', status: 1, token: token });
                }
            }

        }
        else {
            return res.status(400).json({ message: 'Record not found Wrong..', status: 0 });
        }

    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'Somthing Wrong', status: 0 });
    }
}

// Manager Profile
module.exports.profile = async (req, res) => {
    try {
        let managerData = await manager.findById(req.user.id).populate('adminId').exec();
        if (managerData) {
            return res.status(200).json({ message: 'Manager Profile Is Here...', status: 1, ManagerProfile: managerData });
        }
        else {
            return res.status(200).json({ message: 'Manager Profil Is found...', status: 0 });
        }

    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'Somthing Wrong...', status: 0 });
    }
}

// edit Manager Profile
module.exports.edit_profile = async (req, res) => {
    try {
        let oldManagerData = await manager.findById(req.query.id);
        if (req.file) {
            var fullpath = path.join(__dirname, '../../../..', oldManagerData.managerimage);
            try{
                await fs.unlinkSync(fullpath);
            }
            catch(err){
                console.log(err);
            }

            req.body.managerimage = manager.managerImagePath + '/' + req.file.filename;
            var update = await manager.findByIdAndUpdate(req.query.id, req.body);
            if (update) {
                return res.status(200).json({ message: 'Manager Data Susscesfully Update...', status: 1 })
            }
            else {
                return res.status(200).json({ message: 'Manager Data Not Update..', status: 0 })
            }
        }
        else {
            var imagePath = '';
            if (oldManagerData) {
                imagePath = oldManagerData.managerimage;
            }
            req.body.managerimage = oldManagerData.managerimage;
            var update = await manager.findByIdAndUpate(req.query.id, req.body);
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

// view manager
module.exports.view_manager = async (req, res) => {
    try {
        var AllManagerData = await manager.find({});
        if (AllManagerData) {
            return res.status(200).json({ message: 'Manager All Data..', status: 1, AllManagerData: AllManagerData });
        }
        else {
            return res.status(200).json({ message: 'Data Is Found...', status: 0 });
        }

    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'Somthing Wrong...', status: 0 });
    }
}