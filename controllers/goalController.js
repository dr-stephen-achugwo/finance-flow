const Goal = require('../models/Goal');

exports.createGoal = async (req, res) => {
  try {
    const goal = await Goal.create({ ...req.body, user: req.userId });
    req.io.emit('goalUpdate', goal); // Emit after creation
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ error: 'Goal creation failed' });
  }
};

exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.userId });
    res.status(200).json(goals); // Always return 200, even if empty
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
};