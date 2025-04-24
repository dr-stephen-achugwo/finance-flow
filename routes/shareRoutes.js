const express = require('express');
const router = express.Router();
const shareController = require('../controllers/shareController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/', authenticate, shareController.shareExpense);

module.exports = router;