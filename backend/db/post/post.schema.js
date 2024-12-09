const Schema = require('mongoose').Schema;

exports.PostSchema = new Schema({
    content: {
        type: String,
        required: false,
        maxLength: 280,
        default: ''
    },
    imageUrl: {
        type: String,
        required: false
    },
    imagePublicId: {
        type: String,
        required: false
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