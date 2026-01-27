const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required!"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Description is required!"],
    },
    category: {
        type: String,
        required: [true, "Category is required!"],
        trim: true
    },
    type: {
        type: String,
        required: [true, "Post type is required!"],
        enum: ["Offer", "Request"] // Offer = User teaching, Request = User learning
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

// Post model
const Post = mongoose.model('Post', postSchema);

module.exports = Post;