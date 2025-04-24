const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  aiInsights: { type: String },
  createdAt: { type: Date, default: Date.now },
  isRecurring: { type: Boolean, default: false },
  recurrence: {
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly'] },
    endDate: Date
  },
  goal: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal' },
  budget: { type: mongoose.Schema.Types.ObjectId, ref: 'Budget' } // Add budget field

});

module.exports = mongoose.model('Expense', expenseSchema);