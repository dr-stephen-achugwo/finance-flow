const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  limit: { type: Number, required: true },
  period: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
  spent: { type: Number, default: 0 }
});

module.exports = mongoose.model('Budget', budgetSchema);