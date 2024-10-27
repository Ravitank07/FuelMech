const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const imagepath = "/uploades/mechanicimages";

const schema = mongoose.Schema({
    mname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mno: {
        type: String,
        required: true
    },
    landmark: {
        type: String,
        required: true
    },
    sprice: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    mechanicimage: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }
});

const addata = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', imagepath));
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now());
    }
})

schema.statics.uploadimage = multer({
    storage: addata
}).single('mechanicimage');
schema.statics.imgpath = imagepath;

module.exports = mongoose.model("mechanicregistration", schema);