const express = require('express');

const passport = require('passport');
const routes = express.Router();

const fuelctrl = require('../controller/fuelcontroller');

const fuelregistration = require('../models/fuelreegistration');

const passportlocal = require('../config/passportlocal_fuel');

// LOGIN START
routes.get('/', fuelctrl.login);

routes.post('/login',passport.authenticate('local',{failureRedirect :"/fuel"}), fuelctrl.checklogin);
// LOGIN END

// LOGOUT START
routes.get('/logout', (req,res) => {
    req.session.destroy((e)=>{
        if(e){
            console.log(e);
            return res.redirect('back');
        }
        else{
            return res.redirect('/fuel');
        }
    })
})
// LOGOUT END

// CHANGE PASS START
routes.get('/changepass',passportlocal.checkfuelAuth, fuelctrl.changepass);

routes.post('/cpass',passportlocal.checkfuelAuth, fuelctrl.cpass);
// CHANGE PASS END

// FORGOT PASSWORD START
routes.get('/forgotpassword', fuelctrl.forgotpassword);

routes.post('/varifyemail', fuelctrl.varifyemail);

routes.get('/otp', fuelctrl.otp);

routes.post('/verifyotp', fuelctrl.verifyotp);

routes.get('/newpass', fuelctrl.newpass);

routes.post('/checkpass', fuelctrl.checkpass);
// FORGOT PASSWORD END

// REGISTRATION START
routes.get('/registration', fuelctrl.registration);

routes.post('/fuelregistration',fuelregistration.uploadimage, fuelctrl.fuelregistration);
// REGISTRATION END

routes.get('/dashboard', passportlocal.checkfuelAuth, fuelctrl.dashboard)

routes.get('/orders', passportlocal.checkfuelAuth, fuelctrl.orders);

routes.get('/accept/:id', passportlocal.checkfuelAuth, fuelctrl.accept);

routes.get('/cancel/:id', passportlocal.checkfuelAuth, fuelctrl.cancel);

routes.get('/pendingorders', passportlocal.checkfuelAuth, fuelctrl.pendingorders);

routes.get('/orderotp/:id', passportlocal.checkfuelAuth, fuelctrl.orderotp);

routes.post('/verifyorder/:id', passportlocal.checkfuelAuth, fuelctrl.verifyorder);

routes.get('/completeorders', passportlocal.checkfuelAuth, fuelctrl.completeorders);

routes.get('/cancelorders', passportlocal.checkfuelAuth, fuelctrl.cancelorders);

routes.get('/totalorders', passportlocal.checkfuelAuth, fuelctrl.totalorders);

// PROFILE START
routes.get('/profile',passportlocal.checkfuelAuth, fuelctrl.profile);

routes.get('/fuelupdate/:id',passportlocal.checkfuelAuth, fuelctrl.fuelupdate);

routes.post('/edit/:id',passportlocal.checkfuelAuth, fuelregistration.uploadimage,fuelctrl.edit);
// PROFILE END

module.exports = routes;