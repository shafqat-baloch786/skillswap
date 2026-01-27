const asyncWrapper = require('../utils/asyncWrapper');
const Swap = require('../models/Swap');
const Post = require('../models/Post');
const User = require('../models/User');
const ErrorHandlerClass = require('../utils/ErrorHandlerClass');

// Send a swap request to a skill provider
const sendSwapRequest = asyncWrapper(async (req, res, next) => {
    const { postId } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
        return next(new ErrorHandlerClass("Post not found!", 404));
    }

    // Check if requester is the owner
    if (post.owner.toString() === req.user._id.toString()) {
        return next(new ErrorHandlerClass("You cannot request your own post!", 400));
    }

    // HelpPoints Check: User needs points to request help
    const requester = await User.findById(req.user._id);
    if (requester.helpPoints <= 0 && post.type === "Offer") {
        return next(new ErrorHandlerClass("Insufficient HelpPoints! Offer a skill to earn more.", 403));
    }

    const swap = await Swap.create({
        post: postId,
        requester: req.user._id,
        owner: post.owner,
        status: "Pending"
    });

    // Success response
    return res.status(201).json({
        success: true,
        message: "Swap request sent successfully",
        swap
    });
});

// List all incoming and outgoing requests
const getMySwaps = asyncWrapper(async (req, res, next) => {
    
    // Find swaps where user is either the requester or the owner
    const swaps = await Swap.find({
        $or: [
            { requester: req.user._id },
            { owner: req.user._id }
        ]
    }).populate('post', 'title type').populate('requester owner', 'name avatar');

    // Success response
    return res.status(200).json({
        success: true,
        swaps
    });
});

// Update status
const updateSwapStatus = asyncWrapper(async (req, res, next) => {
    const { status } = req.body;
    const swap = await Swap.findById(req.params.id);

    if (!swap) {
        return next(new ErrorHandlerClass("Swap record not found!", 404));
    }

    // Only the owner of the skill can accept/reject
    if (swap.owner.toString() !== req.user._id.toString()) {
        return next(new ErrorHandlerClass("Not authorized to update this status", 401));
    }

    swap.status = status;
    await swap.save();

    // Success response
    return res.status(200).json({
        success: true,
        message: `Swap request ${status.toLowerCase()} successfully`,
        swap
    });
});

// Finalize swap & trigger HelpPoints transfer
const completeSwap = asyncWrapper(async (req, res, next) => {
    const swap = await Swap.findById(req.params.id);

    if (!swap || swap.status !== "Accepted") {
        return next(new ErrorHandlerClass("Swap must be accepted before completion", 400));
    }

    // Find both parties
    const provider = await User.findById(swap.owner);
    const receiver = await User.findById(swap.requester);

    // Transaction Rule Logic:
    // 1. Provider (Teacher) receives +1 Point
    provider.helpPoints += 1;
    // 2. Receiver (Learner) is deducted -1 Point
    receiver.helpPoints -= 1;

    // Save updated points
    await provider.save();
    await receiver.save();

    // 3. Update Swap Status to completed
    swap.status = "Completed";
    await swap.save();

    // Success response
    return res.status(200).json({
        success: true,
        message: "Swap completed! HelpPoints transferred successfully.",
        providerPoints: provider.helpPoints,
        receiverPoints: receiver.helpPoints
    });
});

module.exports = {
    sendSwapRequest,
    getMySwaps,
    updateSwapStatus,
    completeSwap
};