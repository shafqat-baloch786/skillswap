const asyncWrapper = require('../utils/asyncWrapper');
const Swap = require('../models/Swap');
const Post = require('../models/Post');
const User = require('../models/User');
const ErrorHandlerClass = require('../utils/ErrorHandlerClass');
const { sendMeetingEmail, sendOwnerConfirmationEmail } = require('../utils/emailHandler');

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
    }).populate('post', 'title type').populate('requester owner', 'name avatar').sort({ createdAt: -1 });

    // Success response
    return res.status(200).json({
        success: true,
        swaps
    });
});

// Update status
const updateSwapStatus = asyncWrapper(async (req, res, next) => {
    // Destructure status and meeting details from request body
    const { status, meetingDate, meetingTime, meetingLink } = req.body;
    const swap = await Swap.findById(req.params.id);

    if (!swap) {
        return next(new ErrorHandlerClass("Swap record not found!", 404));
    }

    // Only the owner of the skill can accept/reject
    if (swap.owner.toString() !== req.user._id.toString()) {
        return next(new ErrorHandlerClass("Not authorized to update this status", 401));
    }

    // Apply status change
    swap.status = status;
    await swap.save();

    // Trigger Notification: If request is accepted, send meeting details via email
    if (status === 'Accepted') {
        // Populate requester and post info to provide details for the email template
        const details = await Swap.findById(swap._id)
            .populate('requester', 'email name')
            .populate('owner', 'email name')
            .populate('post', 'title');

        await sendMeetingEmail(details.requester.email, {
            requesterName: details.requester.name,
            postTitle: details.post?.title || "Skill Swap",
            meetingDate,
            meetingTime,
            meetingLink,
            accepterName: details.owner.name,
            accepterEmail: details.owner.email
        });

        // Send confirmation email to the person who accepted (the Owner)
        await sendOwnerConfirmationEmail(details.owner.email, {
            ownerName: details.owner.name,
            postTitle: details.post?.title || "Skill Swap",
            meetingDate,
            meetingTime,
            meetingLink,
            partnerName: details.requester.name,
            partnerEmail: details.requester.email
        });
    }

    // Success response
    return res.status(200).json({
        success: true,
        message: `Swap request ${status.toLowerCase()} successfully`,
        swap
    });
});

const completeSwap = asyncWrapper(async (req, res, next) => {
    const swap = await Swap.findById(req.params.id).populate('post');

    if (!swap || swap.status !== "Accepted") {
        return next(new ErrorHandlerClass("Swap must be accepted before completion", 400));
    }

    // Determine provider and receiver based on post type and transfer 1 helpPoint between them
    const isOffer = swap.post.type === "Offer";
    const providerId = isOffer ? swap.owner : swap.requester;
    const receiverId = isOffer ? swap.requester : swap.owner;

    await User.findByIdAndUpdate(providerId, { $inc: { helpPoints: 1 } });
    await User.findByIdAndUpdate(receiverId, { $inc: { helpPoints: -1 } });

    // 2. Update Swap Status
    swap.status = "Completed";
    await swap.save();

    return res.status(200).json({
        success: true,
        message: "Swap completed! HelpPoints transferred successfully."
    });
});

module.exports = {
    sendSwapRequest,
    getMySwaps,
    updateSwapStatus,
    completeSwap
};