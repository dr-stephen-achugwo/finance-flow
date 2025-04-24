const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/', authenticate, goalController.createGoal);
router.get('/', authenticate, goalController.getGoals);

module.exports = router;