const mongoose = require('mongoose');

const schema = mongoose.Schema({
    fuelorderid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'fuelorder'
    },
    mechorderid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mechorder'
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userregistration'
    },
    fuelid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'fuelorder'
    },
    mechid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mechorder'
    },
    rating: {
        type: Number,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    create_date: {
        type: 'string',
        required: true
    }
});

module.exports = mongoose.model("feedback", schema);