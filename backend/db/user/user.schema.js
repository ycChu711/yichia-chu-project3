const Schema = require('mongoose').Schema;

exports.UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 20
    },
    password: {
        type: String,
        required: true
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'usersFall2024',
    timestamps: true
});

exports.UserSchema.index({ username: 1 });