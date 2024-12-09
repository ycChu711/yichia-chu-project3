const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authenticateUser } = require('../middleware/auth');
const { validatePost } = require('../middleware/validation');
const PostModel = require('../db/post/post.model');
const { upload, cloudinary } = require('../config/cloudinary');

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
router.post('/', authenticateUser, upload.single('image'), async (req, res) => {
    console.log('Request body:', req.body);
    console.log('File:', req.file);
    console.log('Cloudinary config:', {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        hasApiKey: !!process.env.CLOUDINARY_API_KEY,
        hasSecret: !!process.env.CLOUDINARY_SECRET
    });

    try {
        const postData = {
            content: req.body.content || '',
            author: req.username
        };

        if (req.file) {
            console.log('Uploading file to Cloudinary...');
            console.log('File details:', req.file);
            postData.imageUrl = req.file.path;
            postData.imagePublicId = req.file.filename;
        }

        console.log('Creating post with data:', postData);
        const newPost = await PostModel.createPost(postData);
        console.log('Created post:', newPost);
        res.json(newPost);
    } catch (err) {
        console.error('Error details:', err);
        console.error('Stack trace:', err.stack);
        res.status(400).json({ error: err.message || 'Error creating post' });
    }
});

// Update post
router.put('/:postId', authenticateUser, upload.single('image'), async (req, res) => {
    try {
        const post = await PostModel.getPostById(req.params.postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.author !== req.username) {
            return res.status(403).json({ error: 'Not authorized to edit this post' });
        }

        const updateData = {
            content: req.body.content || post.content,
            updatedAt: Date.now()
        };

        if (req.file) {
            // Delete old image from Cloudinary if it exists
            if (post.imagePublicId) {
                await cloudinary.uploader.destroy(post.imagePublicId);
            }
            updateData.imageUrl = req.file.path;  // Cloudinary URL
            updateData.imagePublicId = req.file.filename;
        }

        const updatedPost = await PostModel.updatePost(
            req.params.postId,
            updateData
        );

        res.json(updatedPost);
    } catch (err) {
        console.error('Update error:', err);
        res.status(400).json({
            error: 'Error updating post',
            details: err.message
        });
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