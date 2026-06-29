const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Public routes
router.post('/login', authController.adminLogin);

// Protected routes
router.get('/verify', auth, authController.verifyToken);

module.exports = router;
