const Budget = require('../models/Budget');

exports.createBudget = async (req, res) => {
    try {
        const budget = await Budget.create({ ...req.body, user: req.userId });
        res.status(201).json(budget);
    } catch (error) {
        res.status(500).json({ error: 'Budget creation failed' });
    }
};

exports.getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.userId });
        res.json(budgets);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch budgets" });
    }
};