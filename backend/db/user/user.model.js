const mongoose = require("mongoose")
const UserSchema = require('./user.schema').UserSchema;
const UserModel = mongoose.model("UserModel", UserSchema);

function createUser(user) {
    return UserModel.create(user);
}

function findUserByUsername(username) {
    return UserModel.findOne({ username: username }).exec();
}

function searchUsers(query) {
    return UserModel.find({
        username: {
            $regex: query,
            $options: 'i'
        }
    }).select('-password').exec();
}

module.exports = {
    UserModel,
    createUser,
    findUserByUsername,
    searchUsers
};