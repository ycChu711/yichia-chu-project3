const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const PostModel = require('../db/post/post.model');

// Authentication middleware (reusing from user.js)
const authenticateUser = async (req, res, next) => {
    const token = req.cookies.username;
    if (!token) {
        return res.status(401).send('Authentication required');
    }
    try {
        const username = jwt.verify(token, "HUNTERS_PASSWORD");
        req.username = username;
        next();
    } catch (err) {
        res.status(401).send('Invalid token');
    }
};

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await PostModel.getAllPosts();
        res.json(posts);
    } catch (err) {
        res.status(500).send('Error fetching posts');
    }
});

// Get posts by username
router.get('/user/:username', async (req, res) => {
    try {
        const posts = await PostModel.getPostsByUser(req.params.username);
        res.json(posts);
    } catch (err) {
        res.status(500).send('Error fetching user posts');
    }
});

// Create new post (requires authentication)
router.post('/', authenticateUser, async (req, res) => {
    try {
        if (!req.body.content) {
            return res.status(400).send('Content is required');
        }

        const newPost = await PostModel.createPost({
            content: req.body.content,
            author: req.username
        });
        res.json(newPost);
    } catch (err) {
        res.status(400).send('Error creating post');
    }
});

// Update post (requires authentication)
router.put('/:postId', authenticateUser, async (req, res) => {
    try {
        const post = await PostModel.getPostById(req.params.postId);

        if (!post) {
            return res.status(404).send('Post not found');
        }

        if (post.author !== req.username) {
            return res.status(403).send('Not authorized to edit this post');
        }

        const updatedPost = await PostModel.updatePost(
            req.params.postId,
            req.body.content
        );
        res.json(updatedPost);
    } catch (err) {
        res.status(400).send('Error updating post');
    }
});

// Delete post (requires authentication)
router.delete('/:postId', authenticateUser, async (req, res) => {
    try {
        const post = await PostModel.getPostById(req.params.postId);

        if (!post) {
            return res.status(404).send('Post not found');
        }

        if (post.author !== req.username) {
            return res.status(403).send('Not authorized to delete this post');
        }

        await PostModel.deletePost(req.params.postId);
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(400).send('Error deleting post');
    }
});

module.exports = router;