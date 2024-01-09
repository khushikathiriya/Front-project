const express = require('express');

const routes = express.Router();

const passport = require('passport');

const manager = require('../../../../models/manager/managerregistration');

const managercontroller = require('../../../../controller/API/v1/manager/managercontroller');


// add manager with admin token
routes.post('/add_manager', passport.authenticate('admin', { failureRedirect: '/admin/manager/failAdminLogin' }), manager.uploadmanagerimage, managercontroller.add_manager);

// admin fail login
routes.get('/failAdminLogin', async (req, res) => {
    return res.status(400).json({ message: 'Admin Login Fail...', status: 0 })
})

// login
routes.post('/login',managercontroller.login);

routes.get('/view_manager',passport.authenticate('manager',{failureRedirect:'/admin/manager/failManagerLogin'}),managercontroller.view_manager);

routes.get('/profile',passport.authenticate('manager',{failureRedirect:'/admin/manager/failManagerLogin'}),managercontroller.profile);

routes.put('/edit_profile',passport.authenticate('manager',{failureRedirect:'/admin/manager/failManagerLogin'}), manager.uploadmanagerimage,managercontroller.edit_profile)


// manager fail login
routes.get('/failManagerLogin',async(req,res)=>{
    return res.status(400).json({message:'Manager Login Fail...',status:0});
})
module.exports = routes;