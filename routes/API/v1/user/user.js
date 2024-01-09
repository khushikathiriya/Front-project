const express = require('express');

const routes = express.Router();

const usercontroller = require('../../../../controller/API/v1/user/usercontroller');

const user = require('../../../../models/user/userregistration');

const passport = require('passport');

routes.post('/add_user', passport.authenticate('manager', { failureRedirect: '/admin/user/failManagerLogin' }), user.uploaduserimage, usercontroller.add_user);


// manager login fail
routes.get('/failManagerLogin', async (req, res) => {
    return res.status(400).json({ message: 'Manager Login Fail...', status: 0 });
})
routes.post('/login', usercontroller.login);

routes.get('/profile', passport.authenticate('user', { failureRedirect: '/admin/user/failUserLogin' }), usercontroller.profile);

routes.get('/view_user',passport.authenticate('user',{failureRedirect:'/admin/user/failUserLogin'}),usercontroller.view_user);

routes.put('/edit_profile',passport.authenticate('user',{failureRedirect:'/admin/user/failUserLogin'}),user.uploaduserimage,usercontroller.edit_profile)


// user login fail
routes.get('/failUserLogin', async (req, res) => {
    return res.status(400).json({ message: 'User Login Fail...', status: 0 });
})


module.exports = routes;