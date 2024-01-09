const express = require('express');

const jwtstratgy = require('passport-jwt').Strategy;

const jwtExtract = require('passport-jwt').ExtractJwt;

const regisrter = require('../models/Admin/registration');

const manager = require('../models/manager/managerregistration');

const user = require('../models/user/userregistration');

const passport = require('passport');


// code in bcrypt admin
var opts = {
    jwtFromRequest: jwtExtract.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'admin'
};
passport.use('admin', new jwtstratgy(opts, async (Record, done) => {
    // console.log(Record);
    let checkAdmin = await regisrter.findById(Record.userData._id);
    if (checkAdmin) {
        return done(null, checkAdmin);
    }
    else {
        return done(null, false);
    }
}));

// code in bcrypt manager
var opts1 = {
    jwtFromRequest: jwtExtract.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'manager'
};
passport.use('manager', new jwtstratgy(opts1, async (Record, done) => {
    // console.log(Record);
    let checkmanager = await manager.findById(Record.managerData._id);
    if (checkmanager) {
        return done(null, checkmanager);
    }
    else {
        return done(null, false);
    }
}));

// code in bcrypt user
var opts2 = {
    jwtFromRequest: jwtExtract.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'user'
};
passport.use('user', new jwtstratgy(opts2, async (Record, done) => {
    // console.log(Record);
    let checkuser = await user.findById(Record.userData._id);
    if (checkuser) {
        return done(null, checkuser);
    }
    else {
        return done(null, false);
    }
}));

passport.serializeUser(function (user, done) {
    return done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    let recheck = await regisrter.findById(id);
    if (recheck) {
        return done(null, recheck);
    }
    else {
        return done(null, false);
    }
})

module.exports = passport;
