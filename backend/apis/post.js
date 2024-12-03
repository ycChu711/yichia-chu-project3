const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const { validatePost } = require('../middleware/validation');
const PostModel = require('../db/post/post.model');

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await PostModel.getAllPosts();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching posts' });
    }
});

// Get posts by username
router.get('/user/:username', async (req, res) => {
    try {
        const posts = await PostModel.getPostsByUser(req.params.username);
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching user posts' });
    }
});

// Create new post 
router.post('/', authenticateUser, validatePost, async (req, res) => {
    try {
        const newPost = await PostModel.createPost({
            content: req.body.content,
            author: req.username
        });
        res.json(newPost);
    } catch (err) {
        res.status(400).json({ error: 'Error creating post' });
    }
});

// Update post 
router.put('/:postId', authenticateUser, validatePost, async (req, res) => {
    try {
        const post = await PostModel.getPostById(req.params.postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.author !== req.username) {
            return res.status(403).json({ error: 'Not authorized to edit this post' });
        }

        const updatedPost = await PostModel.updatePost(
            req.params.postId,
            req.body.content
        );
        res.json(updatedPost);
    } catch (err) {
        res.status(400).json({ error: 'Error updating post' });
    }
});

// Delete post 
router.delete('/:postId', authenticateUser, async (req, res) => {
    try {
        const post = await PostModel.getPostById(req.params.postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.author !== req.username) {
            return res.status(403).json({ error: 'Not authorized to delete this post' });
        }

        await PostModel.deletePost(req.params.postId);
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Error deleting post' });
    }
});

module.exports = router;