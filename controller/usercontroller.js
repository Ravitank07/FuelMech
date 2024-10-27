const fuel = require('../models/fuelreegistration');
const mechanic = require('../models/mechanicregistration');
const user = require('../models/userregistration');
const forder = require('../models/fuelorder');
const morder = require('../models/mechorder');
const feedback = require('../models/feedback');
const fbill = require('../models/fuelbill');
const mbill = require('../models/mechbill');
const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer');
const download = require('download');
var http = require('http');

const stripe = require("stripe")(
    "sk_test_51NcTKTSJPVXqfKyxUhF9vWZRfiVqqXQWONPt2Q9OaJrm9g7Dpx6CMtv0rysB6cRSsJVCOvma6jZAYpGyXOTVRDZd003H3ndhF9"
  );
  

const fs = require('fs');
const path = require('path');
const moment = require('moment');

// LOGIN START
module.exports.login = async (req,res) => {
    try{
        return res.render('user/login');
    }
    catch(e){
        console.log(e);
        req.flash('error',"something wrong");
        return res.redirect('back');
    }
}

module.exports.checklogin = async (req,res) => {
    try{
        req.flash('success',"successfully login");
        return res.redirect('/user/home');
    }
    catch(e){
        console.log(e);
        req.flash('error',"something went wrong");
        return res.redirect('back');
    }
}
// LOGIN END

// CHANGE PASS START
module.exports.changepassword = async (req,res) => {
    try{
        return res.render('user/changepassword');
    }
    catch(e){
        console.log(e);
        req.flash('error', 'Somthing went wrong');
        return res.redirect('back');
    }
}
module.exports.changepass = async (req,res) => {
    try{

        var passwordRegex = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/;

        if(req.body != null){
            if(req.body.cpass == req.user.password){
                if(req.body.cpass != req.body.npass){
                    if (passwordRegex.test(req.body.npass) && req.body.npass.length >= 6 && req.body.npass.length <= 16) {
                        if (req.body.npass === req.body.cfpass) {
                            await user.findByIdAndUpdate(req.user.id, {password: req.body.npass});
                            req.flash('success', 'Password is Changed Successfully');
                            return res.redirect('/admin/logout');
                        } 
                        else {
                            req.flash('error', "New password and confirm password are not matched");
                            return res.redirect('back');
                        }
                    } 
                    else {
                        req.flash('error', "please enter a strong password (6-16 characters)");
                        return res.redirect('back');
                    }
                }
                else{
                    req.flash('error',"new password can't be same as current password");
                    return res.redirect('back');
                }
            }
            else{
                req.flash('error',"incorrect current password");
                return res.redirect('back');
            }
        }
        else{
            req.flash('error',"please fill the form");;
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

// REGISTRATION START
module.exports.registration = async (req,res) => {
    try{
        return res.render('user/user_registration');
    }
    catch(e){
        console.log(e);
        req.flash('error',"something went wrong");
        return res.redirect('back');
    }
};

module.exports.userregistration = async (req,res) => {
    try{
        var nameRegex = /^[a-zA-Z]{2,30}$/;
        var emailRegex = /^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        var passwordRegex = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/;
        var phoneRegex = /^(0|91)?[6-9][0-9]{9}$/;
        
        if (req.body) {
            if (nameRegex.test(req.body.fname) && nameRegex.test(req.body.lname)) {
                if (emailRegex.test(req.body.email)) {
                    if (passwordRegex.test(req.body.password) && req.body.password.length >= 6 && req.body.password.length <= 16) {
                        if (req.body.password === req.body.cpass) {
                            if (phoneRegex.test(req.body.mno)) {
                                var img = '';
                                if(req.file){
                                    img = user.imgpath + '/' + req.file.filename;
                                }
                                else{
                                    req.flash('error',"please select an image");
                                    return res.redirect('back');
                                }
                                req.body.userimage = img;
                                req.body.name = req.body.fname + " " + req.body.lname;
                                req.body.status = true;
                                let data = await user.create(req.body);
                                if(data){
                                    console.log("data inserted");
                                    req.flash('success',"registered successfull");
                                    return res.redirect('/user');
                                }
                                else{
                                    console.log("data not inserted");
                                    req.flash('error',"Not registered");
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
                } else {
                    req.flash('error', "please enter a valid email address");
                    return res.redirect('back');
                }
            } else {
                req.flash('error', "please enter valid first and last names");
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
        req.flash('error',"something went wrong");
        return res.redirect('back');
    }
}
// REGISTRATION END

// FORGOT PASSWORD START
module.exports.forgotpassword = async (req,res) => {
    try{
        return res.render('user/forgotpassword');
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
                        <h2>here is your otp :- ${otp} </h2>
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
            req.flash("success","Otp sent successfully");
            return res.redirect('otp')

        }
        else{
            console.log("please enter the email");
            req.flash( "error", "Please Enter The Email Address");
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
        return res.render('user/otppage');
    }
    catch(e){
        console.log(e);
        req.flash('error',"something wrong");
        return res.redirect('back');
    }
}

module.exports.verifyotp = async (req,res) => {
    try{
        if(req.body){
            if(req.cookies.otp == req.body.otp){
                req.flash('success',"please enter new password and confirm password");
                return res.redirect('user/newpass');
            }
            else{
                console.log('invalid otp');
                req.flash('error',"invalid otp");
                return res.redirect('back');
            }
        }
        else{
            req.flash('error',"please enter the OTP");
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
        return res.render('user/newpass');
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
                checkemail = await user.findOne({email : req.cookies.email});
                if(checkemail){
                    let changepass = await user.findByIdAndUpdate(checkemail.id, {password : req.body.npass,});
                    if(changepass){
                        res.clearCookie('otp');
                        res.clearCookie('email');
                        req.flash('success','password changed');
                        return  res.redirect('/user');
                    }
                    else{
                        console.log("password not changed");
                        req.flash('error',"password not changed");
                        return res.redirect('back');
                    }
                }
                else{
                    req.flash('error','email id not found, please enter right email address');
                    return res.redirect('back');
                }
            }
            else{
                req.flash('error','new password and confirm password are not same');
                return res.redirect('back');
            }
            } 
            else {
                req.flash('error', "please enter a strong password (6-16 characters)");
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
        req.flash('error',"something wrong");
        return res.redirect('back');
    }
}
// FORGOT PASSWORD END

module.exports.home = async (req,res) => {
    try{
        const feedbackdata = await feedback.find({});
        return res.render('user/home',{
            feedback: feedbackdata
        });
    }
    catch(e){
        console.log(e);
        req.flash('error',"something went wrong");
        return res.redirect('back');
    }
}

module.exports.fuel = async (req,res) => {
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

        let data = await fuel.find({
            status: true,
            $or: [
                {landmark: {$regex: search.replaceAll(" ",""), $options: "i"}},
            ]
        })
        .skip(page*per_page)
        .limit(per_page)

        let totaldata = await fuel.find({
            $or: [
                {landmark: {$regex: search, $options: "i"}},
            ]
        }).countDocuments();
        var totalpages = Math.round(totaldata/per_page);
        var currentpage = page;

        if(data){
            return res.render('user/fuel',{
                data,
                page: totalpages,
                currentpage,
                search
            });
        }
        else{
            console.log("data is not found");
            req.flash('error',"Data not found");
            return res.redirect('back');
        }
    }
    catch(e){
        console.log(e);
        req.flash('error',"something went wrong");
        return res.redirect('back');
    }
}

module.exports.mechanic = async (req,res) => {
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


        let data = await mechanic.find({
            status: true,
            $or: [
                {landmark: {$regex: search.replaceAll(" ",""), $options: "i"}},
            ]
        })
        .skip(page*per_page)
        .limit(per_page)

        let totaldata = await mechanic.find({
            $or: [
                {landmark: {$regex: search, $options: "i"}},
            ]
        }).countDocuments();
        var totalpages = Math.ceil(totaldata/per_page);
        var currentpage = page;

        if(data){
            return res.render('user/mechanic',{
                data,
                page: totalpages,
                currentpage,
                search
            })
        }
        else{
            console.log("data not found");
            req.flash('error',"data not found");
            return res.redirect('back');
        }
    }
    catch(e){
        console.log(e);
        req.flash('error',"something went wrong");
        return res.redirect('back');
    }
}

module.exports.myorders = async (req,res) => {
    try{
        let status = '';
        if(req.query.status){
            status = req.query.status;
        }
        if(status == "all"){
            status = '';
        }

        let fuel_status = '';
        if(req.query.fuel_status){
            fuel_status = req.query.fuel_status;
        }
        if(fuel_status == "all"){
            fuel_status = '';
        }

        let forderdata = await forder.find({
            userid: req.user.id,
            status: {$regex:fuel_status,$options:"i"}
        });
        let morderdata = await morder.find({
            userid: req.user.id,
            status: {$regex:status,$options:"i"}
        });
        if(forderdata){
            return res.render('user/myorders',{
                fuelorderdata: forderdata,
                mechorderdata: morderdata
            });
        }
        else{
            console.log("data not found");
            req.flash('error',"data not found");
            return res.redirect('back');
        }
    }
    catch(e){
        console.log(e);
        req.flash('error',"something went wrong");
        return res.redirect('back');
    }
}

// FUEL FEEDBACK START
module.exports.fuelfeedback = async (req,res) => {
    try{
        return res.render('user/fuelfeedback',{
            orderid: req.params.id
        })
    }
    catch(e){
        console.log(e);
        req.flash('error',"something went wrong");
        return res.redirect('back');
    }
};

module.exports.insertfeedback = async (req,res) => {
    try{
        if(req.body){
            let fuelorder = await forder.find().populate("fuelid").exec();
            fuelorder.map((v,i) => {
            req.body.userid = v.userid;
            req.body.fuelid = v.fuelid.id;
            req.body.create_date = moment().format("lll");
            });
            let data = await feedback.create(req.body);
            if(data){
                console.log("feedback inserted");
                req.flash('success',"feedback inserted");
                return res.redirect('/user/myorders');
            }
            else{
                console.log("feedback not inserted");
                req.flash('error',"feedback not inserted");
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
// FUEL FEEDBACK END

// MECHANIC FEEDBACK START
module.exports.mechanicfeedback = async (req,res) => {
    try{
        return res.render('user/mechfeedback',{
            orderid: req.params.id
        })
    }
    catch(e){
        console.log(e);
        req.flash('error',"something went wrong");
        return res.redirect('back');
    }
};

module.exports.insertmechfeedback = async (req,res) => {
    try{
        let mechorder = await morder.find().populate("mechid").exec();
        console.log(mechorder);
        console.log(req.body);
        mechorder.map((v,i) => {
                req.body.userid = v.userid;
                req.body.mechid = v.mechid.id;
                req.body.create_date = moment().format("lll");
                console.log(req.body);
        });
        let data = await feedback.create(req.body);
                if(data){
                    console.log("feedback inserted");
                    req.flash('success',"feedback inserted");
                    return res.redirect('/user/myorders');
                }
                else{
                    console.log("feedback not inserted");
                    req.flash('error',"feedback not inserted");
                    return res.redirect('back');
                }
    }
    catch(e){
        console.log(e);
        req.flash('error',"something went wrong");
        return res.redirect('back');
    }
}
// MECHANIC FEEDBACK END

module.exports.contactus = (req,res) => {
    try{
        return res.render('user/contact-us')
    }
    catch(e){
        console.log(e);
        req.flash('error',"something went wrong");
        return res.redirect('back');
    }
}

module.exports.fuel_order = async (req,res) => {
    try{
        let fueldata = await fuel.findById(req.params.id);
        if(fueldata){
            return res.render('user/fuel_order',{
                fueldata
            })
        }
        else{
            console.log("data not found");
            req.flash('error',"data not found");
            return res.redirect('back');
        }
    }
    catch(e){
        console.log(e);
        req.flash('error',"something went wrong");
        return res.redirect('back');
    }
}

module.exports.mech_order = async (req,res) => {
    try{
        let mechdata = await mechanic.findById(req.params.id);
        if(mechdata){
            return res.render('user/mech_order',{
                mechdata
            })
        }
        else{
            console.log("data not found");
            req.flash('error',"data not found");
            return res.redirect('back');
        }
    }
    catch(e){
        console.log(e);
        req.flash('error',"something went wrong");
        return res.redirect('back');
    }
}

// EDIT START
module.exports.edit = async (req,res) => {
    try{
        let single = await user.findById(req.params.id);
        if(single){
            return res.render('user/edit',{
                data: single
            })
        }
        else{
            console.log("data not found");
            req.flash('error',"data not found");
            return res.redirect('back');
        }
    }
    catch(e){
        console.log(e);
        req.flash('error',"something went wrong");
        return res.redirect('back');
    }
}

module.exports.update = async (req,res) => {
    try{
        var nameRegex = /^[a-zA-Z]{2,30}$/;
        var emailRegex = /^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        var phoneRegex = /^(0|91)?[6-9][0-9]{9}$/;
        const addressRegex = /^.{1,75}$/;

        if(req.body != null){
            if (nameRegex.test(req.body.fname) && nameRegex.test(req.body.lname)) {
                if (emailRegex.test(req.body.email)) {
                    if(phoneRegex.test(req.body.mno)){
                        if(req.body.gender !== undefined){
                            if(req.file){
                                let single = await user.findById(req.params.id);
                                if(single){
                                    var ipath = path.join(__dirname, "..", single.userimage);
                                    try{
                                        await fs.unlinkSync(ipath);
                                    }
                                    catch(e){
                                        console.log("image is not deletes");
                                        req.flash('error',"image not deleted");
                                        return res.redirect('back');
                                    }
                                    req.body.userimage = user.imgpath + '/' + req.file.filename;
                                    req.body.name = req.body.fname + " " + req.body.lname;
                                    let udata = await user.findByIdAndUpdate(req.params.id, req.body);
                                    if(udata){
                                        console.log("data is updated");
                                        req.flash('success',"data updated");
                                        return res.redirect('/user/logout');
                                    }
                                    else{
                                        console.log("data is not updated");
                                        req.flash('error',"data not updated");
                                        return res.redirect('back');
                                    }
                                }
                                else{
                                    console.log("data is not found");
                                    req.flash('error',"data not found");
                                    return res.redirect('back')
                                }
                            }
                            else{
                                let single = await user.findById(req.params.id);
                                if(single){
                                    req.body.userimage = single.userimage;
                                    req.body.name = req.body.fname + " " + req.body.lname;
                                    let udata = await user.findByIdAndUpdate(req.params.id, req.body);
                                    if(udata){
                                        console.log("data is updated");
                                        req.flash('success',"data updated");
                                        return res.redirect('/user/logout');
                                    }
                                    else{
                                        console.log("data is not updated");
                                        req.flash('error',"data not updated");
                                        return res.redirect('back');
                                    }
                                }
                                else{
                                    console.log("data is not found");
                                    req.flash('error',"data not found");
                                    return res.redirect('back');
                                }
                            }
                        }
                        else {
                            req.flash('error', "please select your gender");
                            return res.redirect('back');
                        }
                    }
                    else {
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
                req.flash('error', "please enter valid first and last names");
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
// EDIT END

// FUEL ORDER START
module.exports.fuelorder = async (req,res) => {
    try{
        if(req.body){
        
            const session = await stripe.checkout.sessions.create({
              payment_method_types: ['card'],
              line_items: [
                {
                  price_data: {
                    currency: "INR",
                    product_data: {
                      name: req.body.ftype,
                    },
                    unit_amount: (req.body.price*100),
                  },
                  quantity: 1,
                },
              ],
              customer_email: req.user.email,
              mode: 'payment',
              success_url: 'http://localhost:8080/user/fuelpayment/success?session_id={CHECKOUT_SESSION_ID}',
              cancel_url: 'http://localhost:8080/user/fuel',
            });
            
        
            let fdata = await fuel.findOne(req.params.id);
            req.body.userid = req.user.id;
            req.body.fuelid = fdata.id
            req.body.landmark = fdata.landmark;
            req.body.create_date = moment().format('lll');
            req.body.email = req.user.email;
            req.body.uname = req.user.name;
            req.body.mno = req.user.mno;
            req.body.fname = fdata.fname;
            req.body.status = "all";

            let data = await new forder({
                ...req.body,
                session_id:session.id,
                payment_status:'pending'
            })

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
                        <h2>You have received a new order</h2>
                    </div>
                    <div class="footer">
                        <p>If you have any questions or need assistance, feel free to contact us at <a href="mailto:dhruvbhikadiya114@gmail.com">fuemech@gmail.com
                        </a>.</p>
                        <p>Thank you,<br>FueMech</p>
                    </div>
                </div>
            </body>
            </html>
            `;
            

            const info = await transporter.sendMail({
                from: 'dhruvbhikadiya114@gmail.gom', // sender address
                to: fdata.email, // list of receivers
                subject: "Email Varification", // Subject line
                text: "Hello world?", // plain text body
                html: message, // html body
            });

            await data.save()
        
            return res.redirect(session.url);
        }
        else{
            console.log("please fill the form");
            req.flash('error',"please fill the form");
            return res.redirect('back');
        }
    }
    catch(e){
        console.log(e);
        req.flash('error',"something wrong");
        return res.redirect('back');
    }
}
// FUEL ORDER END

module.exports.paymentfuelSuccess = async(req,res) =>{
    const {session_id} = req.query;
    let data = await forder.findOneAndUpdate({session_id:session_id},{'payment_status':'paid'},)
   await data.save()

   req.flash('success',"Payment done");
   return res.redirect('/user/myorders')

}

module.exports.paymentmechSuccess = async(req,res) =>{
    const {session_id} = req.query;
    let data = await morder.findOneAndUpdate({session_id:session_id},{'payment_status':'paid'},)
   await data.save()

   req.flash('success',"Payment done");
   return res.redirect('/user/myorders')

}

// MECHANIC ORDER START
module.exports.mechorder = async (req,res) => {
    try{
        const addressRegex = /^.{1,75}$/;

        if(req.body){
            if(addressRegex.test(req.body.address)){
                let mdata = await mechanic.findOne(req.params.id);

            console.log(mdata.sprice);
            const price = Number(mdata.sprice);
            console.log(price);

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                  {
                    price_data: {
                      currency: "INR",
                      product_data: {
                        name: req.body.problem,
                      },
                      unit_amount: (price*100),
                    },
                    quantity: 1,
                  },
                ],
                customer_email: req.user.email,
                mode: 'payment',
                success_url: 'http://localhost:8080/user/mechpayment/success?session_id={CHECKOUT_SESSION_ID}',
                cancel_url: 'http://localhost:8080/user/mechanic',
              });

            
            req.body.userid = req.user.id;
            req.body.mechid = mdata.id
            req.body.landmark = mdata.landmark;
            req.body.create_date = moment().format('lll');
            req.body.email = req.user.email;
            req.body.uname = req.user.name;
            req.body.mno = req.user.mno;
            req.body.mname = mdata.mname;
            req.body.sprice = mdata.sprice;
            req.body.status = "all";
            console.log(req.body);
            let data = await new morder({
                ...req.body,
                session_id:session.id,
                payment_status:'pending'
            });

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
                        <h2>You have received a new order</h2>
                    </div>
                    <div class="footer">
                        <p>If you have any questions or need assistance, feel free to contact us at <a href="mailto:dhruvbhikadiya114@gmail.com">fuemech@gmail.com
                        </a>.</p>
                        <p>Thank you,<br>FueMech</p>
                    </div>
                </div>
            </body>
            </html>
            `;
            

            const info = await transporter.sendMail({
                from: 'dhruvbhikadiya114@gmail.gom', // sender address
                to: mdata.email, // list of receivers
                subject: "Email Varification", // Subject line
                text: "Hello world?", // plain text body
                html: message, // html body
            });

            await data.save()
        
            req.flash('success',"order placed");
            return res.redirect(session.url);
            }
            else{
                req.flash('error',"pllease enter address under 75 character");
                return res.redirect('back');
            }
        }
        else{
            console.log("please fill the form");
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
// MECHANIC ORDER END

// CANCEL ORDER START
module.exports.cancel = async (req,res) => {
    try{
        let fueldata = await forder.findById(req.params.id);
        let mechdata = await morder.findById(req.params.id);
        if(fueldata){
            let cancel = await forder.findByIdAndUpdate(req.params.id,{status: "cancel"});
            if(cancel){
                req.flash('success',"order canceled");
                return res.redirect('back');
            }
            else{
                req.flash('error',"order not canceled");
                return res.redirect('back');
            }
        }
        else if(mechdata){
            let cancel = await morder.findByIdAndUpdate(req.params.id,{status: "cancel"});
            if(cancel){
                req.flash('success',"order canceled");
                return res.redirect('back');
            }
            else{
                req.flash('error',"order not canceled");
                return res.redirect('back');
            }
        }
        else{
            req.flash('error',"Data not found");
            return res.redirect('back');
        }
    }
    catch(e){
        console.log(e);
        req.flash('error',"something went wrong");
        return res.redirect('back');
    }
}
// CANCEL ORDER END

// INVOICES START

// FUEL INVOICE START
module.exports.fuelinvoice = async (req,res) => {
    try{
        let fdata = await fbill.find({orderid: req.params.id}).populate('fuelid').exec();
        return res.render('user/fuelinvoicecopy',{
            fdata,
            id : req.params.id
        });
    }
    catch(e){
        console.log(e);
        req.flash('error',"something wrong");
        return res.redirect('back');
    }
};

module.exports.fuelinvoicecopy = async (req,res) => {
    try{
        let fdata = await fbill.find({orderid: req.params.id}).populate('fuelid').exec();
        return res.render('user/fuelinvoicecopy',{
            fdata,
            id : req.params.id
        });
    }
    catch(e){
        console.log(e);
        req.flash('error',"something wrong");
        return res.redirect('back');
    }
};

// FUEL INVOICE END

// MECHANIC INVOICE START
module.exports.mechanicinvoice = async (req,res) => {
    try{
        let mdata = await mbill.find({orderid: req.params.id}).populate('mechid').exec();
        return res.render('user/mechinvoicecopy',{
            mdata,
            id : req.params.id
        });
    }
    catch(e){
        console.log(e);
        req.flash('error',"something wrong");
        return res.redirect('back');
    }
};
// MECHANIC INVOICE END

// INVOICES END