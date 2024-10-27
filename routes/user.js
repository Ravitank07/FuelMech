const express = require('express');

const routes = express.Router();

const userctrl = require('../controller/usercontroller');

const userregistration = require('../models/userregistration');

const passport = require('../config/passportlocal_fuel');

// LOGIN START
routes.get('/', userctrl.login);

routes.post('/login',passport.authenticate('user',{failureRedirect: '/user'}), userctrl.checklogin);
// LOGIN END

// LOGOUT START
routes.get('/logout', (req,res) => {
    req.session.destroy((e)=>{
        if(e){
            console.log(e);
            return res.redirect('back');
        }
        else{
            return res.redirect('/user');
        }
    })
})
// LOGOUT END

// REGISTRATION START
routes.get('/registration', userctrl.registration);

routes.post('/userregistration',userregistration.uploadimage, userctrl.userregistration);
// REGISTRATION END

// CHANGE PASSWORD START
routes.get('/changepassword', passport.checkuserAuth, userctrl.changepassword);

routes.post('/changepass', passport.checkuserAuth, userctrl.changepass);
// CHANGE PASSWORD END

// FORGOT PASSWORD START
routes.get('/forgotpassword', userctrl.forgotpassword);

routes.post('/varifyemail', userctrl.varifyemail);

routes.get('/otp', userctrl.otp);

routes.post('/verifyotp', userctrl.verifyotp);

routes.get('/newpass', userctrl.newpass);

routes.post('/checkpass', userctrl.checkpass);
// FORGOT PASSWORD END

routes.get('/home', userctrl.home);

routes.get('/fuel', userctrl.fuel);

routes.get('/mechanic', userctrl.mechanic);

routes.get('/myorders',passport.checkuserAuth, userctrl.myorders);

// FUEL FEEDBACK START
routes.get('/fuelfeedback/:id',passport.checkuserAuth, userctrl.fuelfeedback);

routes.post('/insertfeedback', passport.checkuserAuth, userctrl.insertfeedback);
// FUEL FEEDBACK END

// MECHANIC FEEDBACK START
routes.get('/mechanicfeedback/:id',passport.checkuserAuth, userctrl.mechanicfeedback);

routes.post('/insertmechfeedback', passport.checkuserAuth, userctrl.insertmechfeedback);
// MECHANIC FEEDBACK END

routes.get('/contact-us',passport.checkuserAuth, userctrl.contactus);

// EDIT START
routes.get('/edit/:id', passport.checkuserAuth, userctrl.edit);

routes.post('/update/:id', passport.checkuserAuth,userregistration.uploadimage, userctrl.update);
// EDIT END

// FUEL ORDER START
routes.post('/fuelorder', passport.checkuserAuth, userctrl.fuelorder);
// FUEL ORDER END

// FUEL ORDER START
routes.get('/fuel_order/:id',passport.checkuserAuth, userctrl.fuel_order);

routes.post('/fuelorder', passport.checkuserAuth, userctrl.fuelorder);
// FUEL ORDER END

// MECHANIC ORDER START
routes.get('/mech_order/:id',passport.checkuserAuth, userctrl.mech_order);

routes.post('/mechorder', passport.checkuserAuth, userctrl.mechorder);
// MECHANIC ORDER END

// CANCEL ORDER START
routes.get('/cancel/:id',passport.checkuserAuth, userctrl.cancel);
// CANCEL ORDER END

routes.get('/fuelpayment/success',userctrl.paymentfuelSuccess);

routes.get('/mechpayment/success',userctrl.paymentmechSuccess);

// INVOICES START

// FUEL INVOICE START
routes.get('/fuelinvoice/:id', userctrl.fuelinvoice);
// FUEL INVOICE END

// mechanic INVOICE START
routes.get('/mechanicinvoice/:id', userctrl.mechanicinvoice);
// mechanic INVOICE END

// INVOICES END

module.exports = routes;