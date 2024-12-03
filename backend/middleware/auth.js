const jwt = require('jsonwebtoken');

const authenticateUser = async (req, res, next) => {
    const token = req.cookies.username;
    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    try {
        const username = jwt.verify(token, process.env.JWT_SECRET || "HUNTERS_PASSWORD");
        req.username = username;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = { authenticateUser };