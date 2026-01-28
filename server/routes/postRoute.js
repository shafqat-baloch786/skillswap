const express = require('express');
const router = express.Router();
const { createPost, getAllPosts, getPostById, deletePost, getMyPosts } = require('../controllers/postController');
const { auth, catchUser } = require('../middleware/auth');

// Get all posts and Create new post
router.route('/').get(catchUser, getAllPosts).post(auth, createPost);

// Get my own posts
router.get('/my-posts', auth, getMyPosts);

// Get specific post and Delete post
router.route('/:id').get(getPostById).delete(auth, deletePost);


module.exports = router;