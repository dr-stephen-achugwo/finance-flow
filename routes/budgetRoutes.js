const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/', authenticate, budgetController.createBudget);
router.get('/', authenticate, budgetController.getBudgets);

module.exports = router;