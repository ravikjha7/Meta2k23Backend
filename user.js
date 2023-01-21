const Mongoose = require('mongoose');
const { Schema } = Mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contact: {
        type: String,
        required: true
    },
    collegeName: {
        type: String,
        required: true
    },
    yearOfStudy: {
        type: String,
        required: true
    },
    choice: {
        type: String,
        required: true,
        enum: ["docker", "go", "both"]
    },
    bootedLaptops: {
        type: Boolean
    },
    paymentID: {
        type: String,
        required: true,
        unique: true
    },
    time: {
        type: String,
        default: new Date().toLocaleString()
    }
});

module.exports = Mongoose.model('User', UserSchema);