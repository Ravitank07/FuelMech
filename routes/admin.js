const express = require('express');

const adminctrl = require('../controller/admincontroller');

const admin = require('../models/adminregistration');

const passportlocal = require('../config/passportlocal_fuel');

const passport = require('passport');

const routes = express.Router();

// LOGIN START
routes.get('/', adminctrl.login);

routes.post('/login',passport.authenticate('admin',{failureRedirect: '/admin'}), adminctrl.checklogin);
// LOGIN END

// LOGOUT START
routes.get('/logout', (req,res) => {
    req.session.destroy((e)=>{
        if(e){
            console.log(e);
            req.flash('error',"something wrong");
            return res.redirect('back');
        }
        else{
            return res.redirect('/admin');
        }
    })
})
// LOGOUT END

// CHANGE PASS START
routes.get('/changepass',passportlocal.checkadminAuth, adminctrl.changepass);

routes.post('/cpass',passportlocal.checkadminAuth, adminctrl.cpass);
// CHANGE PASS END

// FORGOT PASSWORD START
routes.get('/forgotpassword', adminctrl.forgotpassword);

routes.post('/varifyemail', adminctrl.varifyemail);

routes.get('/otp', adminctrl.otp);

routes.post('/verifyotp', adminctrl.verifyotp);

routes.get('/newpass', adminctrl.newpass);

routes.post('/checkpass', adminctrl.checkpass);
// FORGOT PASSWORD END

// REGISTRATION START
routes.get('/registration', adminctrl.registration);

routes.post('/adminregistration',admin.uploadimage, adminctrl.adminregistration);
// REGISTRATION END

routes.get('/dashboard', passportlocal.checkadminAuth, adminctrl.dashboard);

routes.get('/petrolpump',passportlocal.checkadminAuth, adminctrl.petrolpump);

routes.get('/mechanicshop',passportlocal.checkadminAuth, adminctrl.mechanicshop);

routes.get('/users',passportlocal.checkadminAuth, adminctrl.users);

routes.get('/fuelorder',passportlocal.checkadminAuth, adminctrl.fuelorder);

routes.get('/mechanicorder',passportlocal.checkadminAuth, adminctrl.mechanicorder);

// PROFILE START
routes.get('/profile',passportlocal.checkadminAuth, adminctrl.profile);
// PROFILE END

// FUEL DELETE START
routes.get('/fueldelete/:id', adminctrl.fueldelete);
// FUEL DELETE END

// MECHANIC DELETE START
routes.get('/mechanicdelete/:id', adminctrl.mechanicdelete);
// MECHANIC DELETE END

// USER DELETE START
routes.get('/userdelete/:id', adminctrl.userdelete);
// USER DELETE END

// UPDATE START
routes.get('/adminupdate/:id', passportlocal.checkadminAuth, adminctrl.adminupdate);

routes.post('/edit/:id',passportlocal.checkadminAuth, admin.uploadimage,adminctrl.edit);
// UPDATE END

// FUEL SOFT DELETE START
routes.get('/fueldeactive/:id',passportlocal.checkadminAuth, adminctrl.fueldeactive);

routes.get('/fuelactive/:id',passportlocal.checkadminAuth, adminctrl.fuelactive);
// FUEL SOFT DELETE END

// MECHANIC SOFT DELETE START
routes.get('/mechanicdeactive/:id', adminctrl.mechanicdeactive);

routes.get('/mechanicactive/:id', adminctrl.mechanicactive);
// MECHANIC SOFT DELETE END

// MECHANIC SOFT DELETE START
routes.get('/userdeactive/:id', adminctrl.userdeactive);

routes.get('/useractive/:id', adminctrl.useractive);
// MECHANIC SOFT DELETE END

module.exports = routes;