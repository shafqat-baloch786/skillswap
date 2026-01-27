const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const auth = require('../middleware/auth');
const upload = require('../utils/multer');

// Post method on register with avatar upload
router.post('/register', upload.single('avatar'), register);

// Post method on login
router.post('/login', login);

module.exports = router;