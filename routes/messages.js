const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messages');
const auth = require('../utils/authHandler'); // Assuming auth middleware exists

// GET /messages/:userID - Get all messages between current user and userID
router.get('/:userID', auth, messageController.getMessagesWithUser);

// POST /messages - Send a message
router.post('/', auth, messageController.sendMessage);

// GET /messages - Get last message from each user that current user has messaged with
router.get('/', auth, messageController.getLastMessages);

module.exports = router;