const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/insights', authenticate, aiController.getFinancialInsights);

module.exports = router;