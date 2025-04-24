const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { authenticate } = require('../middleware/authMiddleware'); // Corrected path

router.post('/', authenticate, expenseController.createExpense);
router.get('/', authenticate, expenseController.getExpenses);

module.exports = router;