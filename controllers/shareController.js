const Share = require('../models/Share');

exports.shareExpense = async (req, res) => {
    try {
        const share = await Share.create({ ...req.body, fromUser: req.userId });
        res.status(201).json(share);
    } catch (error) {
        res.status(500).json({ error: 'Expense sharing failed' });
    }
};