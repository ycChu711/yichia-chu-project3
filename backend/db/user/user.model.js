const mongoose = require("mongoose")
const UserSchema = require('./user.schema').UserSchema;
const UserModel = mongoose.model("UserModel", UserSchema);

// Create a new user
function createUser(user) {
    return UserModel.create(user);
}

// Find a user by username
function findUserByUsername(username) {
    return UserModel.findOne({ username: username }).exec();
}

// Search for users by username
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