const fuel = require('../models/fuelreegistration');
const mechanic = require('../models/mechanicregistration');
const admin = require('../models/adminregistration');
const user = require('../models/userregistration');
const fuelorder = require('../models/fuelorder');
const mechorder = require('../models/mechorder');
const feedback = require('../models/feedback');

const path = require('path');
const fs = require('fs');

const nodemailer = require('nodemailer');

// LOGIN START
module.exports.login = async (req,res) => {
    try{
        return res.render('login');
    }
    catch(e){
        console.log(e);
        req.flash('error',"something wrong");
        return res.redirect('back');
    }
}

module.exports.checklogin = async (req,res) => {
    try{
        req.flash('success',"login successfull");
        return res.redirect('dashboard');
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
        return res.render('changepassword');
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
                        if (req.body.npass === req.body.cfpass) {
                            await admin.findByIdAndUpdate(req.user.id, {password: req.body.npass});
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

// FORGOT PASSWORD START
module.exports.forgotpassword = async (req,res) => {
    try{
        return res.render('forgotpassword');
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
        return res.render('otppage');
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
            req.flash('success',"please enter new password and confirm password");
            return res.redirect('newpass');
        }
        else{
            console.log('invalid otp');
            req.flash('error',"invalid otp");
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
        return res.render('newpass');
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
                checkemail = await admin.findOne({email : req.cookies.email});
                if(checkemail){
                    let changepass = await admin.findByIdAndUpdate(checkemail.id, {password : req.body.npass,});
                    if(changepass){
                        res.clearCookie('otp');
                        res.clearCookie('email');
                        req.flash('success','password changed');
                        return  res.redirect('/admin');
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

// REGISTRATION START
module.exports.registration = async (req,res) => {
    try{
        return res.render('admin_registration');
    }
    catch(e){
        console.log(e);
        req.flash('error',"something wrong");
        return res.redirect('back');
    }
}

module.exports.adminregistration = async (req, res) => {
    try {
        var nameRegex = /^[a-zA-Z]{2,30}$/;
        var emailRegex = /^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        var passwordRegex = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/;
        var phoneRegex = /^(0|91)?[6-9][0-9]{9}$/;
        
        if (req.body !== undefined) {
            if (nameRegex.test(req.body.fname) && nameRegex.test(req.body.lname)) {
                if (emailRegex.test(req.body.email)) {
                    if (passwordRegex.test(req.body.password) && req.body.password.length >= 6 && req.body.password.length <= 16) {
                        if (req.body.password === req.body.cpass) {
                            if (phoneRegex.test(req.body.mno)) {
                                if (req.body.gender !== undefined) {
                                    var img = '';
                                    if (req.file) {
                                        img = admin.imgpath + '/' + req.file.filename;
                                    } else {
                                        req.flash('error', "please select an image");
                                        return res.redirect('back');
                                    }
                                    req.body.adminimage = img;
                                    req.body.name = req.body.fname + " " + req.body.lname;
                                    let data = await admin.create(req.body);
                                    if (data) {
                                        console.log("data inserted");
                                        req.flash('success', "registered successfully");
                                        return res.redirect('/admin');
                                    } else {
                                        console.log("data not inserted");
                                        req.flash('error', "Not registered");
                                        return res.redirect('back');
                                    }
                                } else {
                                    req.flash('error', "please select your gender");
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
    } catch (e) {
        console.log(e);
        req.flash('error', "something went wrong");
        return res.redirect('back');
    }
}

// REGISTRATION END

module.exports.dashboard = async (req,res) => {
    try{
        const fdata = await fuel.find({});
        const mdata = await mechanic.find({});
        const udata = await user.find({});
        const forder = await fuelorder.find({});
        const morder = await mechorder.find({});
        console.log(fdata.length);
        return res.render('dashboard',{
            fdata,
            mdata,
            udata,
            forder,
            morder
        });
    }
    catch(e){
        console.log(e);
        req.flash('error',"something wrong");
        return res.redirect('back');
    }
}

module.exports.petrolpump = async (req, res) => {
    try {
        let search = '';
        if (req.query.search) {
            search = req.query.search;
        }

        var page = 0;
        var per_page = 4;

        if (req.query.page) {
            page = req.query.page;
        }

        let fueldata = await fuel.find({
                $or: [{
                        fname: {
                            $regex: search,
                            $options: "i"
                        }
                    },
                    {
                        mno: {
                            $regex: search,
                            $options: "i"
                        }
                    },
                    {
                        email: {
                            $regex: search,
                            $options: "i"
                        }
                    },
                    {
                        landmark: {
                            $regex: search,
                            $options: "i"
                        }
                    },
                    {
                        address: {
                            $regex: search,
                            $options: "i"
                        }
                    }
                ]
            })
            .skip(page * per_page)
            .limit(per_page)

        let totaldata = await fuel.find({
            $or: [{
                    fname: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    mno: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    email: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    landmark: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    address: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ]
        }).countDocuments();
        var totalpages = Math.ceil(totaldata / per_page);
        var currentpage = page;

        let ratings = await feedback.find({});

        // Calculate average rating for each fuel pump
        let averageRatings = {};
        ratings.forEach(rating => {
            if (!averageRatings[rating.fuelid]) {
                averageRatings[rating.fuelid] = {
                    sum: 0,
                    total_rating: 0
                };
            }
            averageRatings[rating.fuelid].sum += rating.rating;
            averageRatings[rating.fuelid].total_rating++;
        });

        // Calculate and store average rating for each fuel pump
        Object.keys(averageRatings).forEach(fuelId => {
            averageRatings[fuelId].averageRating = averageRatings[fuelId].sum / averageRatings[fuelId].total_rating;
        });

        if (fueldata) {
            return res.render('petrolpump', {
                data: fueldata,
                page: totalpages,
                currentpage,
                search,
                ratings,
                averageRatings
            });
        } else {
            console.log("data not found");
            req.flash('error',"data not found");
            return res.redirect('back');
        }
    } catch (e) {
        console.log(e);
        req.flash('error',"something wrong");
        return res.redirect('back');
    }
}

module.exports.mechanicshop = async (req,res) => {
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

        let mechdata = await mechanic.find({
            $or: [
                {mname: {$regex: search, $options: "i"}},
                {mno: {$regex: search, $options: "i"}},
                {email: {$regex: search, $options: "i"}},
                {landmark: {$regex: search, $options: "i"}},
                {address: {$regex: search, $options: "i"}}
            ]
        })
        .skip(page*per_page)
        .limit(per_page)

        let totaldata = await mechanic.find({
            $or: [
                {mname: {$regex: search, $options: "i"}},
                {mno: {$regex: search, $options: "i"}},
                {email: {$regex: search, $options: "i"}},
                {landmark: {$regex: search, $options: "i"}},
                {address: {$regex: search, $options: "i"}}
            ]
        }).countDocuments();
        var totalpages = Math.ceil(totaldata/per_page);
        var currentpage = page;

        let ratings = await feedback.find({});

        // Calculate average rating for each mechanic shop
        let averageRatings = {};
        ratings.forEach(rating => {
            if (!averageRatings[rating.mechid]) {
                averageRatings[rating.mechid] = {
                    sum: 0,
                    total_rating: 0
                };
            }
            averageRatings[rating.mechid].sum += rating.rating;
            averageRatings[rating.mechid].total_rating++;
        });

        // Calculate and store average rating for each mechanic shop
        Object.keys(averageRatings).forEach(mechid => {
            averageRatings[mechid].averageRating = averageRatings[mechid].sum / averageRatings[mechid].total_rating;
        });

        if(mechdata){
            return res.render('mechanicshop',{
                data: mechdata,
                page: totalpages,
                currentpage,
                search,
                ratings,
                averageRatings
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

module.exports.users = async (req,res) => {
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

        let userdata = await user.find({
            $or: [
                {name: {$regex: search, $options: "i"}},
                {mno: {$regex: search, $options: "i"}},
                {email: {$regex: search, $options: "i"}},
                {gender: {$regex: search, $options: "i"}},
            ]
        })
        .skip(page*per_page)
        .limit(per_page)

        let totaldata = await user.find({
            $or: [
                {mname: {$regex: search, $options: "i"}},
                {mno: {$regex: search, $options: "i"}},
                {email: {$regex: search, $options: "i"}},
                {gender: {$regex: search, $options: "i"}},
            ]
        }).countDocuments();
        var totalpages = Math.ceil(totaldata/per_page);
        var currentpage = page;

        if(userdata){
            return res.render('users',{
                data: userdata,
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

module.exports.fuelorder = async (req,res) => {
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

        let orders = await fuelorder.find({
            $or: [
                {fname: {$regex: search, $options: "i"}},
                {uname: {$regex: search, $options: "i"}},
                {mno: {$regex: search, $options: "i"}},
                {email: {$regex: search, $options: "i"}},
                {landmark: {$regex: search, $options: "i"}},
                {ftype: {$regex: search, $options: "i"}},
                {vtype: {$regex: search, $options: "i"}},
                {vno: {$regex: search, $options: "i"}},
                {create_date: {$regex: search, $options: "i"}},
            ]
        })
        .skip(page*per_page)
        .limit(per_page)
        .populate('fuelid')
        .exec();
        let feedbackdata = await feedback.find({fuelid: orders[0].fuelid});

        let totaldata = await fuelorder.find({
            $or: [
                {fname: {$regex: search, $options: "i"}},
                {uname: {$regex: search, $options: "i"}},
                {mno: {$regex: search, $options: "i"}},
                {email: {$regex: search, $options: "i"}},
                {landmark: {$regex: search, $options: "i"}},
                {ftype: {$regex: search, $options: "i"}},
                {vtype: {$regex: search, $options: "i"}},
                {vno: {$regex: search, $options: "i"}},
                {create_date: {$regex: search, $options: "i"}},
            ]
        }).countDocuments();
        var totalpages = Math.ceil(totaldata/per_page);
        var currentpage = page;

        if(orders){
            return res.render('fuelorder',{
                data: orders,
                page: totalpages,
                currentpage,
                search,
                feedbackdata
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

module.exports.mechanicorder = async (req,res) => {
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

        let orders = await mechorder.find({
            $or: [
                {mname: {$regex: search, $options: "i"}},
                {uname: {$regex: search, $options: "i"}},
                {mno: {$regex: search, $options: "i"}},
                {email: {$regex: search, $options: "i"}},
                {landmark: {$regex: search, $options: "i"}},
                {vtype: {$regex: search, $options: "i"}},
                {vno: {$regex: search, $options: "i"}},
                {create_date: {$regex: search, $options: "i"}},
            ]
        })
        .skip(page*per_page)
        .limit(per_page)
        .populate('mechid')
        .exec();
        let feedbackdata = await feedback.find({mechid: orders[0].mechid});

        
        console.log(feedbackdata)
        let totaldata = await mechorder.find({
            $or: [
                {mname: {$regex: search, $options: "i"}},
                {uname: {$regex: search, $options: "i"}},
                {mno: {$regex: search, $options: "i"}},
                {email: {$regex: search, $options: "i"}},
                {landmark: {$regex: search, $options: "i"}},
                {vtype: {$regex: search, $options: "i"}},
                {vno: {$regex: search, $options: "i"}},
                {create_date: {$regex: search, $options: "i"}},
            ]
        }).countDocuments();
        var totalpages = Math.ceil(totaldata/per_page);
        var currentpage = page;

        console.log(orders);
        if(orders){
            return res.render('mechorder',{
                data: orders,
                page: totalpages,
                currentpage,
                search,
                feedbackdata
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

// PROFILE STRAT
module.exports.profile = async (req,res) => {
    try{
        return res.render('profile');
    }
    catch(e){
        console.log(e);
        req.flash('error',"something wrong");
        return res.redirect('back');
    }
}
// PROFILE END

// FUEL DELETE START
module.exports.fueldelete = async (req,res) => {
    try{
        let single = await fuel.findById(req.params.id);
        if(single){
            var imgpath = path.join(__dirname, '..', single.fuelimage);
            try{
                await fs.unlinkSync(imgpath);
            }
            catch(e){
                console.log(e);
                req.flash('error','image is not deleted');
                return res.redirect('back');
            }
            let del = await fuel.findByIdAndDelete(req.params.id);
            if(del){
                req.flash('success','data is deleted');
                return res.redirect('back');
            }
            else{
                req.flash('error','data is not deleted');
                return res.redirect('back');
            }
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
// FUEL DELETE END

// MECHANIC DELETE START
module.exports.mechanicdelete = async (req,res) => {
    try{
        let single = await mechanic.findById(req.params.id);
        if(single){
            var imgpath = path.join(__dirname, '..', single.mechanicimage);
            try{
                await fs.unlinkSync(imgpath);
            }
            catch(e){
                console.log(e);
                req.flash('error','image is not deleted');
                return res.redirect('back');
            }
            let del = await mechanic.findByIdAndDelete(req.params.id);
            if(del){
                req.flash('success','data is deleted');
                return res.redirect('back');
            }
            else{
                req.flash('error','data is not deleted');
                return res.redirect('back');
            }
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
// MECHANIC DELETE END

// USER DELETE START
module.exports.userdelete = async (req,res) => {
    try{
        let single = await user.findById(req.params.id);
        if(single){
            var imgpath = path.join(__dirname, '..', single.userimage);
            try{
                await fs.unlinkSync(imgpath);
            }
            catch(e){
                console.log(e);
                req.flash('error','image is not deleted');
                return res.redirect('back');
            }
            let del = await user.findByIdAndDelete(req.params.id);
            if(del){
                req.flash('success','data is deleted');
                return res.redirect('back');
            }
            else{
                req.flash('error','data is not deleted');
                return res.redirect('back');
            }
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
// USER DELETE END

// UPDATE START
module.exports.adminupdate = async (req,res) => {
    try{
        let single = await admin.findById(req.params.id);
        if(single){
            return res.render('updateadmin',{
                adata: single
            })
        }
        else{
            req.flash('error','data is not found');
            return res.redirect('back');
        }
    }
    catch(e){
        req.flash('error','something went wrong');
        return res.redirect('back');
    }
}

module.exports.edit = async (req,res) => {
    try{
        var nameRegex = /^[a-zA-Z]{2,30}$/;
        var emailRegex = /^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        var passwordRegex = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/;
        var phoneRegex = /^(0|91)?[6-9][0-9]{9}$/;

        if (req.body != undefined) {
            if (nameRegex.test(req.body.fname) && nameRegex.test(req.body.lname)) {
                if (emailRegex.test(req.body.email)) {
                            if (phoneRegex.test(req.body.mno)) {
                                if (req.body.gender !== undefined) {
                                    if(req.file){
                                        let single = await admin.findById(req.params.id);
                                        if(single){
                                            var ipath = path.join(__dirname, "..", single.adminimage);
                                            try{
                                                await fs.unlinkSync(ipath);
                                            }
                                            catch(e){
                                                req.flash('error','image is not deleted');
                                                return res.redirect('back');
                                            }
                                            req.body.adminimage = admin.imgpath + '/' + req.file.filename;
                                            req.body.name = req.body.fname + " " + req.body.lname;
                                            let udata = await admin.findByIdAndUpdate(req.params.id, req.body);
                                            if(udata){
                                                req.flash('success',"data updated");
                                                return res.redirect('/admin/logout');
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
                                        let single = await admin.findById(req.params.id);
                                        if(single){
                                            req.body.adminimage = single.adminimage;
                                            req.body.name = req.body.fname + " " + req.body.lname;
                                            let udata = await admin.findByIdAndUpdate(req.params.id, req.body);
                                            if(udata){
                                                req.flash('success',"data updated");
                                                return res.redirect('/admin/logout');
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
                                } else {
                                    req.flash('error', "please select your gender");
                                    return res.redirect('back');
                                }
                            } else {
                                req.flash('error', "please enter a valid mobile number");
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
// UPDATE END

// FUEL SOFT DELETE START
module.exports.fueldeactive = async (req,res) => {
    try{
        let fueldata = await fuel.findByIdAndUpdate(req.params.id, {status: false});
        if(fueldata){
            req.flash('success', 'Petrol  pump Deactivated');
            return res.redirect('back');
        }
        else{
            req.flash('error', 'Somthing went wrong');
            return res.redirect('back');
        }
    }
    catch(e){
        console.log(e);
        req.flash('error',"something wromg");
        return res.redirect('back');
    }
}

module.exports.fuelactive = async (req,res) => {
    try{
        let fueldata = await fuel.findByIdAndUpdate(req.params.id, {status: true});
        if(fueldata){
            req.flash('success', 'Petrol pump Activated');
            return res.redirect('back');
        }
        else{
            req.flash('error', 'Somthing went wrong');
            return res.redirect('back');
        }
    }
    catch(e){
        console.log(e);
        req.flash('error',"something wrong");
        return res.redirect('back');
    }
}
// FUEL SOFT DELETE END

// MECHANIC SOFT DELETE START
module.exports.mechanicdeactive = async (req,res) => {
    try{
        let mechanicdata = await mechanic.findByIdAndUpdate(req.params.id, {status: false});
        if(mechanicdata){
            req.flash('success', 'shop Deactivated');
            return res.redirect('back');
        }
        else{
            req.flash('error', 'Somthing went wrong');
            return res.redirect('back');
        }
    }
    catch(e){
        console.log(e);
        req.flash('error',"something wrong");
        return res.redirect('back');
    }
}

module.exports.mechanicactive = async (req,res) => {
    try{
        let mechanicdata = await mechanic.findByIdAndUpdate(req.params.id, {status: true});
        if(mechanicdata){
            req.flash('success', 'shop Activated');
            return res.redirect('back');
        }
        else{
            req.flash('error', 'Somthing went wrong');
            return res.redirect('back');
        }
    }
    catch(e){
        console.log(e);
        req.flash('error',"something wrong");
        return res.redirect('back');
    }
}
// MECHANIC SOFT DELETE END

// USER SOFT DELETE START
module.exports.userdeactive = async (req,res) => {
    try{
        let userdata = await user.findByIdAndUpdate(req.params.id, {status: false});
        if(userdata){
            req.flash('success', 'Data is Deactivated');
            return res.redirect('back');
        }
        else{
            req.flash('error', 'Somthing went wrong');
            return res.redirect('back');
        }
    }
    catch(e){
        console.log(e);
        req.flash('error',"something wrong");
        return res.redirect('back');
    }
}

module.exports.useractive = async (req,res) => {
    try{
        let userdata = await user.findByIdAndUpdate(req.params.id, {status: true});
        if(userdata){
            req.flash('success', 'Data is Activated');
            return res.redirect('back');
        }
        else{
            req.flash('error', 'Somthing went wrong');
            return res.redirect('back');
        }
    }
    catch(e){
        console.log(e);
        req.flash('error',"something wrong");
        return res.redirect('back');
    }
}
// USER SOFT DELETE END