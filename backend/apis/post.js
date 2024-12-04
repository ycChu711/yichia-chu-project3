const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authenticateUser } = require('../middleware/auth');
const { validatePost } = require('../middleware/validation');
const PostModel = require('../db/post/post.model');

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

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
    console.log('Content received:', req.body.content);
    try {
        const postData = {
            content: req.body.content || '',
            author: req.username
        };

        if (req.file) {
            postData.imageUrl = `/uploads/${req.file.filename}`;
        }

        console.log('Creating post with data:', postData);
        const newPost = await PostModel.createPost(postData);
        console.log('Created post:', newPost);
        res.json(newPost);
    } catch (err) {
        console.error('Error creating post:', err);
        res.status(400).json({ error: err.message || 'Error creating post' });
    }
});

// Update post
router.put('/:postId', authenticateUser, upload.single('image'), async (req, res) => {
    console.log('Received PUT request:', {
        body: req.body,
        files: req.file,
        params: req.params,
        headers: req.headers
    });

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
            imageUrl: post.imageUrl,
            updatedAt: Date.now()
        };

        // Update image if new one is provided
        if (req.file) {
            updateData.imageUrl = `/uploads/${req.file.filename}`;
        }

        // Make sure we're not stripping both content and image
        if (!updateData.content && !updateData.imageUrl) {
            return res.status(400).json({ error: 'Post must have either content or image' });
        }

        const updatedPost = await PostModel.updatePost(
            req.params.postId,
            updateData
        );

        console.log('Post updated successfully:', updatedPost);
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