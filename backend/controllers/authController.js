const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@chronicle.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(ADMIN_PASSWORD, 10);

// Admin login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check credentials
    if (email !== ADMIN_EMAIL) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatches = bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);

    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token (valid for 24 hours)
    const token = jwt.sign(
      { email, role: 'admin' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({ token, user: { email, role: 'admin' } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify token endpoint
exports.verifyToken = (req, res) => {
  res.json({ valid: true, user: req.user });
};
