const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Credential = require('../models/Credential');

// Admin/login using credentials stored in DB
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find credential by username (email)
    const credential = await Credential.findOne({ username: email.toLowerCase() });
    if (!credential) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatches = await bcrypt.compare(password, credential.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { username: credential.username, role: credential.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({ token, user: { username: credential.username, role: credential.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify token endpoint
exports.verifyToken = (req, res) => {
  res.json({ valid: true, user: req.user });
};
