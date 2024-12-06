const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validateUser } = require('../middleware/validation');
const { authenticateUser } = require('../middleware/auth');
const UserModel = require('../db/user/user.model');

// Get user profile
router.get('/:username', async (req, res) => {
    try {
        const userData = await UserModel.findUserByUsername(req.params.username);
        if (!userData) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { password, ...userWithoutPassword } = userData.toObject();
        res.json(userWithoutPassword);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching user data' });
    }
});

// Register new user
router.post('/register', validateUser, async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user already exists
        const existingUser = await UserModel.findUserByUsername(username);
        if (existingUser) {
            return res.status(409).json({ error: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await UserModel.createUser({
            username,
            password: hashedPassword
        });

        // Generate token
        const token = jwt.sign(username, process.env.JWT_SECRET || "HUNTERS_PASSWORD");

        // Set cookie and send response
        res.cookie('username', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error creating user' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await UserModel.findUserByUsername(username);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(username, process.env.JWT_SECRET || "HUNTERS_PASSWORD");

        // Set cookie and send response
        res.cookie('username', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({ message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ error: 'Error during login' });
    }
});

// Check auth status
router.get('/auth/status', authenticateUser, async (req, res) => {
    try {
        const user = await UserModel.findUserByUsername(req.username);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const { password, ...userWithoutPassword } = user.toObject();
        res.json(userWithoutPassword);
    } catch (err) {
        res.status(500).json({ error: 'Error checking auth status' });
    }
});

// Search users
router.get('/search/:query', async (req, res) => {
    try {
        const searchQuery = req.params.query;
        console.log('Search query received:', searchQuery);

        if (!searchQuery) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        const users = await UserModel.searchUsers(searchQuery);
        console.log('Found users:', users.length);

        res.json(users);
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({ error: 'Error searching users' });
    }
});

// Logout
router.post('/logout', (req, res) => {
    res.cookie('username', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0
    });
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;