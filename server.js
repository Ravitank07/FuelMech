const express = require('express');
const path = require('path');

const port = 8080;

const app = express();

const db = require('./config/connection');

const fuelmodel = require('./models/fuelreegistration');

const passportlocal_fuel = require('./config/passportlocal_fuel');
const passport = require('passport');
const session = require('express-session');

const flashmessage = require('./config/flashmessages');
const connectflash = require('connect-flash');

const cp = require('cookie-parser');

// EJS SETUP START
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//  EJS SETUP END

app.use(cp());

app.use(express.urlencoded());

// ASSETS FOLDER SETUP START
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'userassets')));
app.use(express.static(path.join(__dirname, 'fuelassets')));
app.use(express.static(path.join(__dirname, 'mechanicassets')));
//  ASSETS FOLDER SETUP END

// UPLOADS FOLDER SETUP START
app.use('/uploades',express.static(path.join(__dirname,'uploades')));
// UPLOADS FOLDER SETUP END

app.use(session({
    name: "fuel",
    secret: "fuemech",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600000
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passportlocal_fuel.setfuelAuth);
app.use(passportlocal_fuel.setmechAuth);
app.use(passportlocal_fuel.setadminAuth);
app.use(passportlocal_fuel.setuserAuth);

app.use(connectflash());
app.use(flashmessage.setflash);

// ROUTES START
app.use('/', require('./routes'));
//  ROUTES END

app.listen(port,(e)=>{
    e?console.log(e):console.log('server is running on port :- ',port);
})