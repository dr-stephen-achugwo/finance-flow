const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const Goal = require('../models/Goal');
const { predictCategory } = require('../utils/ai');

exports.createExpense = async (req, res) => {
  try {
    const { amount, description, isRecurring, recurrence, goal, budget } = req.body;
    const category = await predictCategory(description);

    // --- 1. Budget Check (if applicable) ---
    if (budget) {
      const selectedBudget = await Budget.findById(budget);
      if (!selectedBudget) {
        return res.status(400).json({ error: 'Selected budget not found.' });
      }
      if (selectedBudget.limit - selectedBudget.spent < parseFloat(amount)) {
        return res.status(400).json({ error: 'Expense exceeds the remaining budget limit.' });
      }
      selectedBudget.spent += parseFloat(amount);
      await selectedBudget.save();
      req.io.emit('budgetUpdate', selectedBudget);
    }

    // --- 2. Goal Check (if applicable) ---
    if (goal) {
      const selectedGoal = await Goal.findById(goal);
      if (!selectedGoal) {
        return res.status(400).json({ error: 'Selected goal not found.' });
      }
      // *** KEY CHANGE: Check if goal is already completed ***
      if (selectedGoal.completed) {
          return res.status(400).json({ error: 'Selected goal has already been completed.' });
      }

       if (selectedGoal.currentAmount + parseFloat(amount) > selectedGoal.targetAmount) {
            return res.status(400).json({error: 'Expense exceeds the remaining goal limit'})
        }

        selectedGoal.currentAmount += parseFloat(amount);
        //Setting goal to complete if goal is reached
        if(selectedGoal.currentAmount >= selectedGoal.targetAmount){
            selectedGoal.completed = true;
        }
        await selectedGoal.save();
        req.io.emit('goalUpdate', selectedGoal);


    }
    // --- 3. Create the Expense (AFTER budget and goal checks) ---
    const expense = await Expense.create({
      user: req.userId,
      amount,
      category,
      description,
      isRecurring,
      recurrence,
      goal,
      budget
    });

    req.io.emit('expenseUpdate', expense);
    res.status(201).json(expense);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Expense creation failed' });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.userId }).sort('-createdAt');
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
};