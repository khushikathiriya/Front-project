const express = require('express');

const routes = express.Router();

const passport = require('passport');

const admincontroller = require('../../../../controller/API/v1/Admin/admincontroller');

const regisrter = require('../../../../models/Admin/registration');

routes.post('/Registration', regisrter.uploadregistraimage, admincontroller.Registration);

routes.post('/login', admincontroller.login);

routes.get('/view_admin_data', passport.authenticate('admin', { failureRedirect: '/admin/fail_login' }), admincontroller.view_admin_data);

routes.get('/profile', passport.authenticate('admin', { failureRedirect: '/admin/fail_login' }), admincontroller.profile)

routes.put('/profileEdit', passport.authenticate('admin', { failureRedirect: '/admin/fail_login' }),regisrter.uploadregistraimage, admincontroller.profileEdit)


// token not a mention
routes.get('/fail_login', async (req, res) => {
    return res.status(400).json({ message: 'Invalid Email...', status: 0 })
});

// manager path :-
routes.use('/manager',require('../manager/manager'));

// user path :-
routes.use('/user',require('../user/user'));


module.exports = routes;