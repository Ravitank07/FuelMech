const mechregister = require('../models/mechanicregistration');
const mechorder = require('../models/mechorder');
const feedback = require('../models/feedback');
const bill = require('../models/mechbill');

const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const moment = require('moment');

// LOGIN START
module.exports.login = (req,res) => {
    return res.render('mechanic/login')
}

module.exports.checklogin = async (req,res) => {
    try{
        req.flash('success',"login successfull");
        return res.redirect('/mechanic/dashboard');
    }
    catch(e){
        console.log(e);
        req.flash('error',"something went wrong");
        return res.redirect('back');
    }
}
// LOGIN END

// CHANGE PASS START
module.exports.changepass = async (req,res) => {
    try{
        console.log(req.user.password);
        return res.render('mechanic/changepassword');
    }
    catch(e){
        console.log(e);
        req.flash('error', 'Somthing went wrong');
        return res.redirect('back');
    }
}
module.exports.cpass = async (req,res) => {
    try{
        var passwordRegex = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/;

        if(req.body != null){
            if(req.body.cpass == req.user.password){
                if(req.body.cpass != req.body.npass){
                    if (passwordRegex.test(req.body.npass) && req.body.npass.length >= 6 && req.body.npass.length <= 16) {
                        if(req.body.npass == req.body.cfpass){
                            await mechregister.findByIdAndUpdate(req.user.id, {password: req.body.npass});
                            req.flash('success', 'Password is Changed Successfully');
                            return res.redirect('/mechanic/logout');
                        }
                        else{
                            req.flash('error', 'new password and confirm password are not matched');
                            return res.redirect('back');
                        }
                    }
                    else{
                        req.flash('error', "please enter a strong password (6-16 characters)");
                        return res.redirect('back');
                    }
                }
                else{
                    req.flash('error', 'current password and new password are both same');
                    return res.redirect('back');
                }
            }
            else{
                req.flash('error', 'current password is not matchede');
                return res.redirect('back');
            }
        }
        else{
            req.flash('error',"please fill the form");
            return res.redirect('back');
        }
    }
    catch(e){
        console.log(e);
        req.flash('error', 'Somthing went wrong');
        return res.redirect('back');
    }
}
// CHANGE PASS END

// FORGOT PASSWORD START
module.exports.forgotpassword = async (req,res) => {
    try{
        return res.render('mechanic/forgotpassword');
    }
    catch(e){
        console.log(e);
        req.flash('error',"something wrong");
        return res.redirect('back');
    }
}

module.exports.varifyemail = async (req,res) => {
    try{
        if(req.body){
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                    user: "dharmikchhodvdiya@gmail.com",
                    pass: "wpeyeoaukdmcwhiv",
                },
            });

            otp = Math.round(Math.random()*1000000);
            res.cookie('otp',otp);
            res.cookie('email',req.body.email);
            message = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        color: #333;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        padding: 20px;
                        background-color: #fff;
                        border-radius: 8px;
                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    }
                    .logo {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .logo img {
                        width: 150px;
                        height: auto;
                    }
                    .message {
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    .user-details {
                        margin-bottom: 30px;
                    }
                    .footer {
                        text-align: center;
                        font-size: 12px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="message">
                    <h3>here is your otp :- ${otp} </h3>
                    </div>
                    <div class="footer">
                        <p>If you have any questions or need assistance, feel free to contact us at <a href="mailto:dhruvbhikadiya114@gmail.com">fuemech@gmail.com
                        </a>.</p>
                        <p>Thank you,<br>FueMech</p>
                    </div>
                </div>
            </body>
            </html>`;

            const info = await transporter.sendMail({
                from: 'dhruvbhikadiya114@gmail.gom', // sender address
                to: req.body.email, // list of receivers
                subject: "Email Varification", // Subject line
                text: "Hello world?", // plain text body
                html: message, // html body
            });

            req.flash('success',"OTP sent");
            return res.redirect('/mechanic/otp')

        }
        else{
            console.log("please enter the email");
            req.flash('error',"Please enter the email");
            return res.redirect('back');
        }
    }
    catch(e){
        console.log(e);
        req.flash('error',"something wrong");
        return res.redirect('back');
    }
}

module.exports.otp = async (req,res) => {
    try{
        return res.render('mechanic/otppage');
    }
    catch(e){
        console.log(e);
        req.flash('error',"something wrong");
        return res.redirect('back');
    }
}

module.exports.verifyotp = async (req,res) => {
    try{
        if(req.cookies.otp == req.body.otp){
            return res.redirect('/mechanic/newpass');
        }
        else{
            console.log('invalid otp');
            req.flash('error',"Invalid OTP");
            return res.redirect('back');
        }
    }
    catch(e){
        console.log(e);
        req.flash('error',"something wrong");
        return res.redirect('back');
    }
}

module.exports.newpass = async (req,res) => {
    try{
        return res.render('mechanic/newpass');
    }
    catch(e){
        console.log(e);
        req.flash('error',"something wrong");
        return res.redirect('back');
    }
}

module.exports.checkpass = async (req,res) => {
    try{
        var passwordRegex = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/;

        if(req.body != null){
            if (passwordRegex.test(req.body.npass) && req.body.npass.length >= 6 && req.body.npass.length <= 16) {
                if(req.body.npass == req.body.cpass){
                    checkemail = await mechregister.findOne({email : req.cookies.email});
                    if(checkemail){
                        let changepass = await mechregister.findByIdAndUpdate(checkemail.id, {password : req.body.npass,});
                        if(changepass){
                            res.clearCookie('otp');
                            res.clearCookie('email');
                            req.flash('success','password changed');
                            return  res.redirect('/mechanic');
                        }
                        else{
                            console.log("password not changed");
                            req.flash('error',"password not changed");
                            return res.redirect('back');
                        }
                    }
                    else{
                        req.flash('error','data is not found');
                        return res.redirect('back');
                    }
                }
                else{
                    req.flash('error','new password and confirm password are not same');
                    return res.redirect('back');
                }
            }
            else{
                req.flash('error','please enter a strong password (6-16 characters)');
                return res.redirect('back');
            }
        }
        else{
            req.flash('error',"plaese fill the form");
            return res.redirect('back');
        }
    }
    catch(e){
        console.log(e);
        req.flash('error',"something wrong");
        return res.redirect('back');
    }
}
// FORGOT PASSWORD END

// REGISTRATION START
module.exports.registration = async (req,res) => {
    try{
        return res.render('mechanic/mechanic_registration');
    }
    catch(e){
        console.log(e);
        req.flash('error',"something wrong");
        return res.redirect('back');
    }
}

module.exports.mechregistration = async (req,res) => {
    try{
        var emailRegex = /^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        var passwordRegex = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/;
        var phoneRegex = /^(0|91)?[6-9][0-9]{9}$/;

        const mechanic = await mechregister.findOne({email:req.body.email});
        
        if (req.body) {
            if (req.body.mname) {
                if (emailRegex.test(req.body.email)) {
                    if(!mechanic){
                        if (passwordRegex.test(req.body.password) && req.body.password.length >= 6 && req.body.password.length <= 16) {
                            if (req.body.password === req.body.cpass) {
                                if (phoneRegex.test(req.body.mno)) {
                                    var img = '';
                                    if(req.file){
                                        img = mechregister.imgpath + "/" +req.file.filename;
                                    }
                                    else{
                                        console.log("please select an image");
                                        req.flash('error',"Please select an image");
                                        return res.redirect('back');
                                    }
                                    req.body.mechanicimage = img;
                                    req.body.status = true;
                                    let data = await mechregister.create(req.body);
                                    if(data){
                                        console.log("data inserted successfully");
                                        req.flash('success',"Data inserted successfully");
                                        return res.redirect('/mechanic/orders');
                                    }
                                    else{
                                        console.log("data not inserted");
                                        req.flash('error',"Data not inserted");
                                        return res.redirect('back');
                                    }
                                } else {
                                    req.flash('error', "please enter a valid mobile number");
                                    return res.redirect('back');
                                }
                            } else {
                                req.flash('error', "password and confirm password do not match");
                                return res.redirect('back');
                            }
                        } else {
                            req.flash('error', "please enter a strong password (6-16 characters)");
                            return res.redirect('back');
                        }
                    }
                    else{
                        req.flash('error',"Email allready exist");
                        return res.redirect('back');
                    }
                } else {
                    req.flash('error', "please enter a valid email address");
                    return res.redirect('back');
                }
            } else {
                req.flash('error', "please enter a mechanic shop name");
                return res.redirect('back');
            }
        } else {
            console.log("please fill the form");
            req.flash('error', "please fill the form");
            return res.redirect('back');
        }
    }
    catch(e){
        console.log(e);
        req.flash('error',"something wrong");
        return res.redirect('back');
    }
}
// REGISTRATION END

module.exports.dashboard = async (req,res) => {
    try{
        const total = await mechorder.find({mechid:req.user.id});
        const current = await mechorder.find({mechid:req.user.id,status: "all"});
        const pending = await mechorder.find({mechid:req.user.id,status: "pending"});
        const cancel = await mechorder.find({mechid:req.user.id,status: "cancel"});
        const complete = await mechorder.find({mechid:req.user.id,status: "complete"});

        return res.render('mechanic/dashboard',{
            total,
            current,
            pending,
            complete,
            cancel
        });
    }
    catch(e){
        console.log(e);
        req.flash('error',"something wrong");
    }
}

module.exports.orders = async (req,res) => {
    try{
        let search = '';
        if(req.query.search){
            search = req.query.search;
        }

        var page = 0;
        var per_page = 4;

        if(req.query.page){
            page = req.query.page;
        }

        const order = await mechorder.find({
            mechid: req.user.id,
            status: "all",
            $or: [
                {uname: {$regex: search, $options: "i"}},
                {email: {$regex: search, $options: "i"}},
                {mno: {$regex: search, $options: "i"}},
                {landmark: {$regex: search, $options: "i"}},
                {vtype: {$regex: search, $options: "i"}},
                {create_date: {$regex: search, $options: "i"}} 
            ]
        })
        .skip(page*per_page)
        .limit(per_page)

        let totaldata = await mechorder.find({
            mechid : req.user.id,
            status: "all",
            $or: [
                {uname: {$regex: search, $options: "i"}},
                {email: {$regex: search, $options: "i"}},
                {mno: {$regex: search, $options: "i"}},
                {landmark: {$regex: search, $options: "i"}},
                {vtype: {$regex: search, $options: "i"}},
                {create_date: {$regex: search, $options: "i"}} 
            ]
        }).countDocuments();
        var totalpages = Math.round(totaldata/per_page);
        var currentpage = page;

        return res.render('mechanic/orders',{
            order,
            page: totalpages,
            currentpage,
            search
        });
    }
    catch(e){
        console.log(e);
        req.flash('error',"something wrong");
        return res.redirect('back');
    }
}

module.exports.accept = async (req,res) => {
    try{
        let order = await mechorder.findByIdAndUpdate(req.params.id,{status: "pending"});
        console.log("hello");
        console.log(order);
        console.log("hello");
        if(order){
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                    user: "dharmikchhodvdiya@gmail.com",
                    pass: "wpeyeoaukdmcwhiv",
                },
            });

            res.cookie('email',req.body.email);
            message = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        color: #333;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        padding: 20px;
                        background-color: #fff;
                        border-radius: 8px;
                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    }
                    .logo {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .logo img {
                        width: 150px;
                        height: auto;
                    }
                    .message {
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    .user-details {
                        margin-bottom: 30px;
                    }
                    .footer {
                        text-align: center;
                        font-size: 12px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="message">
                        <h3>Your order has been accepted.</h3>
                    </div>
                    <div class="footer">
                        <p>If you have any questions or need assistance, feel free to contact us at <a href="mailto:dhruvbhikadiya114@gmail.com">fuemech@gmail.com
                        </a>.</p>
                        <p>Thank you,<br>FueMech</p>
                    </div>
                </div>
            </body>
            </html>`;

            const info = await transporter.sendMail({
                from: 'dhruvbhikadiya114@gmail.gom', // sender address
                to: order.email, // list of receivers
                subject: "Email Varification", // Subject line
                text: "Hello world?", // plain text body
                html: message, // html body
            });
            console.log("order shifted to pending mode");
            req.flash('success',"Order shifted to pending mode");
            return res.redirect('back');
        }
        else{
            console.log("order not shifted to pending mode");
            req.flash('error',"Order not shifted to pending mode");
            return res.redirect('back');
        }
    }
    catch(e){
        console.log(e);
        req.flash('error',"something wrong");
        return res.redirect('back');
    }
};

module.exports.cancel = async (req,res) => {
    try{
        let order = await mechorder.findByIdAndUpdate(req.params.id,{status: "cancel"});
        if(order){
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                    user: "dharmikchhodvdiya@gmail.com",
                    pass: "wpeyeoaukdmcwhiv",
                },
            });

            message = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        color: #333;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        padding: 20px;
                        background-color: #fff;
                        border-radius: 8px;
                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    }
                    .logo {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .logo img {
                        width: 150px;
                        height: auto;
                    }
                    .message {
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    .user-details {
                        margin-bottom: 30px;
                    }
                    .footer {
                        text-align: center;
                        font-size: 12px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="message">
                        <h3>Your order has been canceled.</h3>
                    </div>
                    <div class="footer">
                        <p>If you have any questions or need assistance, feel free to contact us at <a href="mailto:dhruvbhikadiya114@gmail.com">fuemech@gmail.com
                        </a>.</p>
                        <p>Thank you,<br>FueMech</p>
                    </div>
                </div>
            </body>
            </html>`;

            const info = await transporter.sendMail({
                from: 'dhruvbhikadiya114@gmail.gom', // sender address
                to: order.email, // list of receivers
                subject: "Email Varification", // Subject line
                text: "Hello world?", // plain text body
                html: message, // html body
            });
            console.log("order shifted to cancel mode");
            req.flash('success',"Order shifted to cancel mode");
            return res.redirect('back');
        }
        else{
            console.log("order not shifted to cancel mode");
            req.flash('error',"Order shifted to cancel mode");
            return res.redirect('back');
        }
    }
    catch(e){
        console.log(e);
        req.flash('error',"something wrong");
        return res.redirect('back');
    }
};

module.exports.pendingorders = async (req,res) => {
    try{
        let search = '';
        if(req.query.search){
            search = req.query.search;
        }

        var page = 0;
        var per_page = 4;

        if(req.query.page){
            page = req.query.page;
        }

        let order = await mechorder.find({
            mechid: req.user.id,
            status: "pending",
            $or: [
                {uname: {$regex: search, $options: "i"}},
                {email: {$regex: search, $options: "i"}},
                {mno: {$regex: search, $options: "i"}},
                {landmark: {$regex: search, $options: "i"}},
                {vtype: {$regex: search, $options: "i"}},
                {create_date: {$regex: search, $options: "i"}} 
            ]
        })
        .skip(page*per_page)
        .limit(per_page)

        let totaldata = await mechorder.find({
            mechid : req.user.id,
            status: "pending",
            $or: [
                {uname: {$regex: search, $options: "i"}},
                {email: {$regex: search, $options: "i"}},
                {mno: {$regex: search, $options: "i"}},
                {landmark: {$regex: search, $options: "i"}},
                {vtype: {$regex: search, $options: "i"}},
                {create_date: {$regex: search, $options: "i"}} 
            ]
        }).countDocuments();
        var totalpages = Math.round(totaldata/per_page);
        var currentpage = page;

        return res.render('mechanic/pendingorders',{
            order,
            page: totalpages,
            currentpage,
            search
        });
    }
    catch(e){
        console.log(e);
        req.flash('error',"something wrong");
        return res.redirect('back');
    }
}

module.exports.orderotp = async (req,res) => {
    try{
        const orderdata = await mechorder.findById(req.params.id);
        const email = orderdata.email;

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                user: "dharmikchhodvdiya@gmail.com",
                pass: "wpeyeoaukdmcwhiv",
            },
        });

        let services = req.body.services;
        let price = req.body.price;
        otp = Math.round(Math.random()*1000000);
        res.cookie('otp',otp);
        res.cookie('email',email);
        res.cookie('services',services);
        res.cookie('price',price);
        message = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    color: #333;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 8px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
                .logo {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .logo img {
                    width: 150px;
                    height: auto;
                }
                .message {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .user-details {
                    margin-bottom: 30px;
                }
                .footer {
                    text-align: center;
                    font-size: 12px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="message">
                    <h2>Services :- ${services}</h2><br/><br/><h2>total price :- ${price}</h2><br/><br/><h2>If service is done then give this OTP to supplier...</h2><br/><h2here is your otp :- ${otp} </h2>
                </div>
                <div class="footer">
                    <p>If you have any questions or need assistance, feel free to contact us at <a href="mailto:dhruvbhikadiya114@gmail.com">fuemech@gmail.com
                    </a>.</p>
                    <p>Thank you,<br>FueMech</p>
                </div>
            </div>
        </body>
        </html>`;

        const info = await transporter.sendMail({
            from: 'dhruvbhikadiya114@gmail.gom', // sender address
            to: email, // list of receivers
            subject: "Email Varification", // Subject line
            text: "Hello world?", // plain text body
            html: message, // html body
        });

        if(info){
            console.log("otp send");
            return res.render('mechanic/orderotp',{
                id: req.params.id
            });
        }
        else{
            console.log("otp not send");
            return res.redirect('back');
        }
    }
    catch(e){
        console.log(e);
        req.flash('error',"something wrong");
        return res.redirect('back');
    }
};

module.exports.verifyorder = async (req,res) => {
    try{
        if(req.cookies.otp == req.body.otp){
            let orders = await mechorder.findByIdAndUpdate(req.params.id,{status: "complete"});
            if(orders){
                let billdata = {
                    orderid: orders.id,
                    userid: orders.userid,
                    mechid: orders.mechid,
                    uname: orders.uname,
                    mname: orders.mname,
                    email: orders.email,
                    mno: orders.mno,
                    landmark: orders.landmark,
                    vtype: orders.vtype,
                    vno: orders.vno,
                    services: req.cookies.services,
                    price : parseInt(req.cookies.price) + parseInt(orders.sprice),
                    create_date: moment().format('lll'),
                };
                let fbill = await bill.create(billdata);
                if(fbill){
                    const transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 465,
                        secure: true,
                        auth: {
                            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                            user: "dharmikchhodvdiya@gmail.com",
                            pass: "wpeyeoaukdmcwhiv",
                        },
                    });
            
                    otp = Math.round(Math.random()*1000000);
                    res.cookie('otp',otp);
                    res.cookie('email',email);
                    message = `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f4f4f4;
                                color: #333;
                                margin: 0;
                                padding: 0;
                            }
                            .container {
                                max-width: 600px;
                                margin: 20px auto;
                                padding: 20px;
                                background-color: #fff;
                                border-radius: 8px;
                                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                            }
                            .logo {
                                text-align: center;
                                margin-bottom: 20px;
                            }
                            .logo img {
                                width: 150px;
                                height: auto;
                            }
                            .message {
                                text-align: center;
                                margin-bottom: 30px;
                            }
                            .user-details {
                                margin-bottom: 30px;
                            }
                            .footer {
                                text-align: center;
                                font-size: 12px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="message">
                                <h2>Invoice is generated</h2>
                            </div>
                            <div class="footer">
                                <p>If you have any questions or need assistance, feel free to contact us at <a href="mailto:dhruvbhikadiya114@gmail.com">fuemech@gmail.com
                                </a>.</p>
                                <p>Thank you,<br>FueMech</p>
                            </div>
                        </div>
                    </body>
                    </html>`;
            
                    const info = await transporter.sendMail({
                        from: 'dhruvbhikadiya114@gmail.gom', // sender address
                        to: email, // list of receivers
                        subject: "Email Varification", // Subject line
                        text: "Hello world?", // plain text body
                        html: message, // html body
                    });
                    console.log("bill created");
                    console.log("order shift to complete");
                    req.flash('success',"Bill created");
                    req.flash('success',"Order shift to complete");
                    return res.redirect('/mechanic/completeorders');
                }
                else{
                    console.log("bill not created");
                    req.flash('error',"Bill not created");
                    return res.redirect('back');
                }
            }
            else{
                console.log("order not shift to complete");
                req.flash('error',"Order not shift to complete");
                return res.redirect('/mechanic/pendingorders');
            }
        }
        else{
            console.log('invalid otp');
            req.flash('error',"Invalid OTP");
            return res.redirect('back');
        }
    }
    catch(e){
        console.log(e);
        req.flash('error',"something wrong");
        return res.redirect('back');
    }
};

module.exports.completeorders = async (req,res) => {
    try{
        let search = '';
        if(req.query.search){
            search = req.query.search;
        }

        var page = 0;
        var per_page = 4;

        if(req.query.page){
            page = req.query.page;
        }

        let order = await mechorder.find({
            mechid: req.user.id,
            status: "complete",
            $or: [
                {uname: {$regex: search, $options: "i"}},
                {email: {$regex: search, $options: "i"}},
                {mno: {$regex: search, $options: "i"}},
                {landmark: {$regex: search, $options: "i"}},
                {vtype: {$regex: search, $options: "i"}},
                {create_date: {$regex: search, $options: "i"}} 
            ]
        })
        .skip(page*per_page)
        .limit(per_page)

        let totaldata = await mechorder.find({
            mechid : req.user.id,
            status: "complete",
            $or: [
                {uname: {$regex: search, $options: "i"}},
                {email: {$regex: search, $options: "i"}},
                {mno: {$regex: search, $options: "i"}},
                {landmark: {$regex: search, $options: "i"}},
                {vtype: {$regex: search, $options: "i"}},
                {create_date: {$regex: search, $options: "i"}} 
            ]
        }).countDocuments();
        var totalpages = Math.round(totaldata/per_page);
        var currentpage = page;

        let feedbackdata = await feedback.find({mechid: req.user.id});

        console.log(feedbackdata);

        if(order){
            console.log(order,"order---")
            return res.render('mechanic/completeorders',{
                order,
                feedbackdata,
                page: totalpages,
                currentpage,
                search
            });
        }
        else{
            console.log("data not found");
            req.flash('error',"Data not found");
            return res.redirect('back');
        }
    }
    catch(e){
        console.log(e);
        req.flash('error',"something wrong");
        return res.redirect('back');
    }
}

module.exports.cancelorders = async (req,res) => {
    try{
        let search = '';
        if(req.query.search){
            search = req.query.search;
        }

        var page = 0;
        var per_page = 4;

        if(req.query.page){
            page = req.query.page;
        }

        let order = await mechorder.find({
            mechid: req.user.id,
            status: "cancel",
            $or: [
                {uname: {$regex: search, $options: "i"}},
                {email: {$regex: search, $options: "i"}},
                {mno: {$regex: search, $options: "i"}},
                {landmark: {$regex: search, $options: "i"}},
                {vtype: {$regex: search, $options: "i"}},
                {create_date: {$regex: search, $options: "i"}} 
            ]
        })
        .skip(page*per_page)
        .limit(per_page)

        let totaldata = await mechorder.find({
            mechid : req.user.id,
            status: "cancel",
            $or: [
                {uname: {$regex: search, $options: "i"}},
                {email: {$regex: search, $options: "i"}},
                {mno: {$regex: search, $options: "i"}},
                {landmark: {$regex: search, $options: "i"}},
                {vtype: {$regex: search, $options: "i"}},
                {create_date: {$regex: search, $options: "i"}} 
            ]
        }).countDocuments();
        var totalpages = Math.round(totaldata/per_page);
        var currentpage = page;

        return res.render('mechanic/cancelorders',{
            order,
            page: totalpages,
            currentpage,
            search
        });
    }
    catch(e){
        console.log(e);
        req.flash('error',"something wrong");
        return res.redirect('back');
    }
}

module.exports.totalorders = async (req,res) => {
    try{
        let search = '';
        if(req.query.search){
            search = req.query.search;
        }

        var page = 0;
        var per_page = 4;

        if(req.query.page){
            page = req.query.page;
        }

        const order = await mechorder.find({
            mechid: req.user.id,
            $or: [
                {uname: {$regex: search, $options: "i"}},
                {email: {$regex: search, $options: "i"}},
                {mno: {$regex: search, $options: "i"}},
                {landmark: {$regex: search, $options: "i"}},
                {vtype: {$regex: search, $options: "i"}},
                {create_date: {$regex: search, $options: "i"}} 
            ]
        })
        .skip(page*per_page)
        .limit(per_page)

        let totaldata = await mechorder.find({
            mechid : req.user.id,
            status: "pending",
            $or: [
                {uname: {$regex: search, $options: "i"}},
                {email: {$regex: search, $options: "i"}},
                {mno: {$regex: search, $options: "i"}},
                {landmark: {$regex: search, $options: "i"}},
                {vtype: {$regex: search, $options: "i"}},
                {create_date: {$regex: search, $options: "i"}} 
            ]
        }).countDocuments();
        var totalpages = Math.round(totaldata/per_page);
        var currentpage = page;

        return res.render('mechanic/totalorders',{
            orders : order,
            page: totalpages,
            currentpage,
            search
        });
    }
    catch(e){
        console.log(e);
        req.flash('error',"something wrong");
        return res.redirect('back');
    }
}

// PROFILE STRAT
module.exports.profile = async (req,res) => {
    try{
        return res.render('mechanic/profile');
    }
    catch(e){
        console.log(e);
        req.flash('error',"something wrong");
        return res.redirect('back');
    }
}
// PROFILE END

// UPDATE START
module.exports.mechupdate = async (req,res) => {
    try{
        let single = await mechregister.findById(req.params.id);
        if(single){
            return res.render('mechanic/updatemechanic',{
                adata: single
            })
        }
        else{
            req.flash('error','data is not found');
            return res.redirect('back');
        }
    }
    catch(e){
        console.log(e);
        req.flash('error','something went wrong');
        return res.redirect('back');
    }
}

module.exports.edit = async (req,res) => {
    try{
        var nameRegex = /^[a-zA-Z]{2,30}$/;
        var emailRegex = /^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        var phoneRegex = /^(0|91)?[6-9][0-9]{9}$/;
        const addressRegex = /^.{1,75}$/;

        if(req.body != null){
            if (nameRegex.test(req.body.mname)) {
                if (emailRegex.test(req.body.email)) {
                    if (phoneRegex.test(req.body.mno)) {
                        if (req.body.landmark !== undefined) {
                            if(addressRegex.test(req.body.address)){
                                if(req.file){
                                    let single = await mechregister.findById(req.params.id);
                                    if(single){
                                        var ipath = path.join(__dirname, "..", single.mechanicimage);
                                        try{
                                            await fs.unlinkSync(ipath);
                                        }
                                        catch(e){
                                            req.flash('error','image is not deleted');
                                            return res.redirect('back');
                                        }
                                        req.body.mechanicimage = mechregister.imgpath + '/' + req.file.filename;
                                        let udata = await mechregister.findByIdAndUpdate(req.params.id, req.body);
                                        if(udata){
                                            req.flash('success',"data updated");
                                            return res.redirect('/mechanic/logout');
                                        }
                                        else{
                                            req.flash('error',"data is not updated");
                                            return res.redirect('back');
                                        }
                                    }
                                    else{
                                        req.flash('error',"data is not found");
                                        return res.redirect('back')
                                    }
                                }
                                else{
                                    let single = await mechregister.findById(req.params.id);
                                    if(single){
                                        req.body.mechanicimage = single.mechanicimage;
                                        let udata = await mechregister.findByIdAndUpdate(req.params.id, req.body);
                                        if(udata){
                                            req.flash('success',"data updated");
                                            return res.redirect('/mechanic/logout');
                                        }
                                        else{
                                            req.flash('error',"data is not updated");
                                            return res.redirect('back');
                                        }
                                    }
                                    else{
                                        req.flash('error',"data is not found");
                                        return res.redirect('back');
                                    }
                                }
                            }
                            else{
                                req.flash('error',"Please enter address within 75 character");
                                return res.redirect('back');
                            }
                        }
                        else{
                            req.flash('error', "please select your landmark");
                            return res.redirect('back');
                        }
                    }
                    else{
                        req.flash('error', "please enter a valid mobile number");
                                return res.redirect('back');
                    }
                }
                else{
                    req.flash('error', "please enter a valid email address");
                    return res.redirect('back');
                }
            }
            else{
                req.flash('error', "please enter valid fuel station name");
                return res.redirect('back');
            }
        }
        else{
            req.flash('error',"please fill the form");
            return res.redirect('back');
        }
    }
    catch(e){
        console.log(e);
        req.flash('error',"something went wrong");
        return res.redirect('back');
    }
}
// UPDATE END