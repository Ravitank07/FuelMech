const mongoose = require('mongoose');

const schema = mongoose.Schema({
    orderid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'fuelorder'
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userregistration'
    },
    fuelid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'fuelregistration'
    },
    uname: {
        type: String,
        required: true
    },
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
    vtype: {
        type: String,
        required: true
    },
    vno: {
        type: String,
        required: true
    },
    ftype: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    create_date: {
        type: 'string',
        required: true
    }
});

module.exports = mongoose.model("fuelbill", schema);