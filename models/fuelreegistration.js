const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const imagepath = "/uploades/fuelimages";

const schema = mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    email: {
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
    address: {
        type: String,
        required: true
    },
    pprice: {
        type: String,
        required: true
    },
    dprice: {
        type: String,
        required: true
    },
    fuelimage: {
        type: String,
        required: true
    },
    password : {
        type : String,
        required : true
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
}).single('fuelimage');
schema.statics.imgpath = imagepath;

module.exports = mongoose.model("fuelregistration", schema);