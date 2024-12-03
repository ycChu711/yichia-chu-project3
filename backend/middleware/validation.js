const validatePost = (req, res, next) => {
    const { content } = req.body;
    if (!content || content.trim().length === 0) {
        return res.status(400).json({ error: 'Post content is required' });
    }
    if (content.length > 280) {
        return res.status(400).json({ error: 'Post content must be 280 characters or less' });
    }
    next();
};

const validateUser = (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    if (username.length < 3 || username.length > 20) {
        return res.status(400).json({ error: 'Username must be between 3 and 20 characters' });
    }
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    next();
};

module.exports = { validatePost, validateUser };