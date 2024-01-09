const express = require('express')

const port = 9001;

const app = express();

const passport = require('passport');

const session = require('express-session');

const cors = require('cors');
app.use(cors());

const passport_jwt_strtegy = require('./config/passport_jwt_strtegy');

const mongoose = require('./config/mongoose');

app.use(express.urlencoded());

app.use(session({
    name : 'khushi',
    secret : 'khushi',
    resave : false,
    saveUninitialized : false,
    cookie : {
        maxAge : 1000*60*100,
    }
    
}))

app.use(passport.initialize());
app.use(passport.session());

app.use('/admin',require('./routes/API/v1/Admin/admin'));

app.listen(port, (err) => {
    if (err) console.log('Something Is Wrong..!')

    console.log('sever runing is port', 9001);
})
