const asyncWrapper = require('../utils/asyncWrapper');
const Post = require('../models/Post');
const ErrorHandlerClass = require('../utils/ErrorHandlerClass');

// Create a new skill post
const createPost = asyncWrapper(async (req, res, next) => {
    const { title, description, category, type } = req.body;

    // Create post with owner id from auth middleware
    const post = await Post.create({
        title,
        description,
        category,
        type,
        owner: req.user._id
    });

    // Success response
    return res.status(201).json({
        success: true,
        message: "Skill post created successfully",
        post
    });
});

// Fetch all skill posts with filters
const getAllPosts = asyncWrapper(async (req, res, next) => {
    const { category, type } = req.query;

    let query = {};

    // Only exclude current user's own posts if logged in
    if (req.user && req.user._id) {
        query.owner = { $ne: req.user._id };
    }

    // Apply category filter if provided
    if (category) {
        query.category = category;
    }

    // Apply type filter (Offer/Request) if provided
    if (type) {
        query.type = type;
    }

    // Find posts and populate owner details
    const posts = await Post.find(query).populate('owner', 'name avatar helpPoints')
        .sort({ createdAt: -1 });

    // Success response
    return res.status(200).json({
        success: true,
        count: posts.length,
        posts
    });
});

// Fetch only the logged-in user's posts
const getMyPosts = asyncWrapper(async (req, res, next) => {
    // Find posts where owner is current user
    const posts = await Post.find({ owner: req.user._id })
        .sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        posts
    });
});


// Get specific post details
const getPostById = asyncWrapper(async (req, res, next) => {

    // Find post by ID and populate owner
    const post = await Post.findById(req.params.id).populate('owner', 'name avatar helpPoints');

    // If post not found
    if (!post) {
        return next(new ErrorHandlerClass("Post not found!", 404));
    }

    // Success response
    return res.status(200).json({
        success: true,
        post
    });
});

// Remove a post
const deletePost = asyncWrapper(async (req, res, next) => {

    const post = await Post.findById(req.params.id);

    // If post not found
    if (!post) {
        return next(new ErrorHandlerClass("Post not found!", 404));
    }

    // Check if the user is the owner of the post
    if (post.owner.toString() !== req.user._id.toString()) {
        return next(new ErrorHandlerClass("You are not authorized to delete this post", 401));
    }

    await post.deleteOne();

    // Success response
    return res.status(200).json({
        success: true,
        message: "Post deleted successfully"
    });
});

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    deletePost,
    getMyPosts,
};