const mongoose = require('mongoose');

const shareSchema = new mongoose.Schema({
  expense: { type: mongoose.Schema.Types.ObjectId, ref: 'Expense', required: true },
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  permissionLevel: { type: String, enum: ['view', 'edit'], required: true }
});

module.exports = mongoose.model('Share', shareSchema);