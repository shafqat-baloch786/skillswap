const express = require('express');
const router = express.Router();
const { 
    sendSwapRequest, getMySwaps, updateSwapStatus, completeSwap } = require('../controllers/swapController');
const auth = require('../middleware/auth');

// Send a new swap request
router.post('/request', auth, sendSwapRequest);

// Get all swaps for the current user
router.get('/my-swaps', auth, getMySwaps);

// Update status of a swap (Accept/Reject)
router.put('/:id/status', auth, updateSwapStatus);

// Finalize swap and transfer HelpPoints
router.post('/:id/complete', auth, completeSwap);

module.exports = router;