const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const auth = require('../middleware/auth');

// Post method on register
router.post('/register', register);

// Post method on login
router.post('/login', login);

module.exports = router;