const passport = require('passport');

const localstrategy = require('passport-local').Strategy;

const fuel = require('../models/fuelreegistration');
const mech = require('../models/mechanicregistration');
const admin = require('../models/adminregistration');
const user = require('../models/userregistration');

// FUEL
passport.use(new localstrategy({usernameField: 'email'}, async (email,password,done) => {
    let checkemail = await fuel.findOne({email: email});
    if(checkemail){
        if(checkemail.password == password){
            return done(null, checkemail);
        }
        else{
            return done(null, false);
        }
    }
    else{
        return done(null,false);
    }
}));

// MECHANIC
passport.use('mech',new localstrategy({usernameField: 'email'}, async (email,password,done) => {
    let checkemail = await mech.findOne({email: email});
    if(checkemail){
        if(checkemail.password == password){
            return done(null, checkemail);
        }
        else{
            return done(null,false);
        }
    }
    else{
        return done(null,false);
    }
}));

// ADMIN
passport.use('admin',new localstrategy({usernameField: 'email'}, async (email,password,done) => {
    let checkemail = await admin.findOne({email: email});
    if(checkemail){
        if(checkemail.password == password){
            return done(null, checkemail);
        }
        else{
            return done(null,false);
        }
    }
    else{
        return done(null,false);
    }
}));

// ADMIN
passport.use('user',new localstrategy({usernameField: 'email'}, async (email,password,done) => {
    let checkemail = await user.findOne({email: email});
    if(checkemail){
        if(checkemail.password == password){
            return done(null, checkemail);
        }
        else{
            return done(null,false);
        }
    }
    else{
        return done(null,false);
    }
}));

passport.serializeUser(async (user,done) => {
    return done(null, user.id);
});

passport.deserializeUser(async (id,done) => {
    let fueldata = await fuel.findById(id);
    let mechdata = await mech.findById(id);
    let admindata = await admin.findById(id);
    let userdata = await user.findById(id);
    if(fueldata){
        return done(null,fueldata);
    }
    else if(mechdata){
        return done(null,mechdata);
    }
    else if(admindata){
        return done(null,admindata);
    }
    else if(userdata){
        return done(null,userdata);
    }
    else{
        return done(null, false);
    }
});

// FUEL
passport.setfuelAuth = (req,res,next) => {
    if(req.isAuthenticated()){
        res.locals.fuel = req.user;
    }
    next();
};

// MECHANIC
passport.setmechAuth = (req,res,next) => {
    if(req.isAuthenticated()){
        res.locals.mechanic = req.user;
    }
    next();
};

// ADMIN
passport.setadminAuth = (req,res,next) => {
    if(req.isAuthenticated()){
        res.locals.admin = req.user;
    }
    next();
};

// USER
passport.setuserAuth = (req,res,next) => {
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }
    next();
};

// FUEL
passport.checkfuelAuth = (req,res,next) => {
    if(req.isAuthenticated()){
        next();
    }
    else{
        return res.redirect('/fuel');
    }
};

// MECHANIC
passport.checkmechAuth = (req,res,next) => {
    if(req.isAuthenticated()){
        next();
    }
    else{
        return res.redirect('/mechanic');
    }
};

// ADMIN
passport.checkadminAuth = (req,res,next) => {
    if(req.isAuthenticated()){
        next();
    }
    else{
        return res.redirect('/admin');
    }
};

// USER
passport.checkuserAuth = (req,res,next) => {
    if(req.isAuthenticated()){
        next();
    }
    else{
        return res.redirect('/user');
    }
};

module.exports = passport;