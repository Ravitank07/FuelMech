const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const imagepath = "/uploades/userimages";

const schema = mongoose.Schema({
    name: {
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
    gender: {
        type: String,
        required: true
    },
    userimage: {
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
}).single('userimage');
schema.statics.imgpath = imagepath;

module.exports = mongoose.model("userregistration", schema);