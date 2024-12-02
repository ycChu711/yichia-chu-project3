const Schema = require('mongoose').Schema;

exports.PostSchema = new Schema({
    content: {
        type: String,
        required: true,
        maxLength: 280
    },
    author: {
        type: String,
        required: true,
        ref: 'UserModel'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { collection: 'postsFall2024' });