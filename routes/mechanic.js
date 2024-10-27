const express = require('express');

const routes = express.Router();

const mechctrl = require('../controller/mechaniccontroller');

const mechregister = require('../models/mechanicregistration');

const passport = require('passport');

const passportlocal = require('../config/passportlocal_fuel');

// LOGIN START
routes.get('/', mechctrl.login);

routes.post('/login',passport.authenticate('mech',{failureRedirect: '/mechanic'}) , mechctrl.checklogin);
// LOGIN END

// LOGOUT START
routes.get('/logout', (req,res) => {
    req.session.destroy((e)=>{
        if(e){
            console.log(e);
            return res.redirect('back');
        }
        else{
            return res.redirect('/mechanic');
        }
    })
})
// LOGOUT END

// CHANGE PASS START
routes.get('/changepass',passportlocal.checkmechAuth, mechctrl.changepass);

routes.post('/cpass',passportlocal.checkmechAuth, mechctrl.cpass);
// CHANGE PASS END

// FORGOT PASSWORD START
routes.get('/forgotpassword', mechctrl.forgotpassword);

routes.post('/varifyemail', mechctrl.varifyemail);

routes.get('/otp', mechctrl.otp);

routes.post('/verifyotp', mechctrl.verifyotp);

routes.get('/newpass', mechctrl.newpass);

routes.post('/checkpass', mechctrl.checkpass);
// FORGOT PASSWORD END

// REGISTRATION START
routes.get('/registration', mechctrl.registration);

routes.post('/mechregistration',mechregister.uploadimage, mechctrl.mechregistration);
// REGISTRATION END

routes.get('/dashboard', passportlocal.checkmechAuth, mechctrl.dashboard);

routes.get('/orders',passportlocal.checkmechAuth, mechctrl.orders);

routes.get('/accept/:id', passportlocal.checkfuelAuth, mechctrl.accept);

routes.get('/cancel/:id', passportlocal.checkfuelAuth, mechctrl.cancel);

routes.get('/pendingorders',passportlocal.checkmechAuth, mechctrl.pendingorders);

routes.post('/orderotp/:id', passportlocal.checkfuelAuth, mechctrl.orderotp);

routes.post('/verifyorder/:id', passportlocal.checkfuelAuth, mechctrl.verifyorder);

routes.get('/completeorders',passportlocal.checkmechAuth, mechctrl.completeorders);

routes.get('/cancelorders',passportlocal.checkmechAuth, mechctrl.cancelorders);

routes.get('/totalorders',passportlocal.checkmechAuth, mechctrl.totalorders);

// PROFILE START
routes.get('/profile',passportlocal.checkmechAuth, mechctrl.profile);

routes.get('/mechanicupdate/:id',passportlocal.checkmechAuth, mechctrl.mechupdate);

routes.post('/edit/:id',passportlocal.checkmechAuth, mechregister.uploadimage,mechctrl.edit);
// PROFILE END

module.exports = routes;