const mongoose = require("mongoose");
const PostSchema = require('./post.schema').PostSchema;

const PostModel = mongoose.model("PostModel", PostSchema);

// Create a new post
function createPost(post) {
    return PostModel.create(post);
}

// Get all posts, sorted by newest first
function getAllPosts() {
    return PostModel.find()
        .sort({ createdAt: -1 })
        .exec();
}

// Get posts by a specific user
function getPostsByUser(username) {
    return PostModel.find({ author: username })
        .sort({ createdAt: -1 })
        .exec();
}

// Update a post
function updatePost(postId, content) {
    return PostModel.findByIdAndUpdate(
        postId,
        {
            content: content,
            updatedAt: Date.now()
        },
        { new: true }
    ).exec();
}

// Delete a post
function deletePost(postId) {
    return PostModel.findByIdAndDelete(postId).exec();
}

// Get a single post by ID
function getPostById(postId) {
    return PostModel.findById(postId).exec();
}

module.exports = {
    createPost,
    getAllPosts,
    getPostsByUser,
    updatePost,
    deletePost,
    getPostById
};