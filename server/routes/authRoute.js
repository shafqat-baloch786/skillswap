const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile } = require('../controllers/authController');
const auth = require('../middleware/auth');
const upload = require('../utils/multer');

// Post method on register with avatar upload
router.post('/register', upload.single('avatar'), register);

// Post method on login
router.post('/login', login);

// Get method for current user profile
router.get('/me', auth, getMe);

// Patch method to update user profile
router.patch('/update', auth, upload.single('avatar'), updateProfile);

module.exports = router;