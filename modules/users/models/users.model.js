const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
     _id: {
        type: Schema.Types.ObjectId,
        auto: true,
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address']
    },
    creationDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    address: {
        type: String,
        required: [true, 'Address is required']
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
});

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;