const express = require('express');
const router = express.Router();
const { createPost, getAllPosts, getPostById, deletePost } = require('../controllers/postController');
const auth = require('../middleware/auth');

// Get all posts and Create new post
router.route('/').get(getAllPosts).post(auth, createPost);

// Get specific post and Delete post
router.route('/:id').get(getPostById).delete(auth, deletePost);

module.exports = router;