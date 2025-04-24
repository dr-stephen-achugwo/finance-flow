const cron = require('node-cron');
const Expense = require('../models/Expense');
const mongoose = require('mongoose');

const processRecurringExpenses = async () => {
    try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    const recurringExpenses = await Expense.find({
      isRecurring: true,
      'recurrence.endDate': { $gte: today }
    });

    for (const expense of recurringExpenses) {
      let shouldCreateNewExpense = false;
      const lastExpenseDate = expense.createdAt;
      lastExpenseDate.setHours(0,0,0,0);
      const frequency = expense.recurrence.frequency;

        switch (frequency) {
          case 'daily':
            shouldCreateNewExpense = true;

            break;
          case 'weekly':
            if (today.getDay() === lastExpenseDate.getDay()) { //same day of week
              shouldCreateNewExpense = true;
            }
            break;
          case 'monthly':
                if (today.getDate() === lastExpenseDate.getDate()) {
                  shouldCreateNewExpense = true;
                }
            break;
      }

        if (shouldCreateNewExpense) {
            const timeDiff = Math.abs(today.getTime() - lastExpenseDate.getTime());
            let dayDiff;
            switch(frequency){
                case 'daily':
                    dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                    if(dayDiff > 1) { //Handles missed days
                        for(let i = 1; i < dayDiff; i++) {
                            const newExpenseDate = new Date(lastExpenseDate);
                            newExpenseDate.setDate(lastExpenseDate.getDate() + i);
                            await Expense.create({
                                user: expense.user,
                                amount: expense.amount,
                                category: expense.category,
                                description: expense.description,
                                createdAt: newExpenseDate,
                                isRecurring: false, // Important: Don't make the generated expense recurring!
                              });
                        }

                    }
                break;
                case 'weekly':
                     dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                    if(dayDiff > 7) { //Handles missed weeks
                        for(let i = 7; i < dayDiff; i+=7) {
                            const newExpenseDate = new Date(lastExpenseDate);
                            newExpenseDate.setDate(lastExpenseDate.getDate() + i);
                             await Expense.create({
                                user: expense.user,
                                amount: expense.amount,
                                category: expense.category,
                                description: expense.description,
                                createdAt: newExpenseDate,
                                isRecurring: false, // Important: Don't make the generated expense recurring!
                              });
                        }
                    }
                break;
                case 'monthly':
                    const monthDiff = (today.getFullYear() - lastExpenseDate.getFullYear()) * 12 + (today.getMonth() - lastExpenseDate.getMonth());
                    if(monthDiff > 1) {
                        for(let i = 1; i < monthDiff; i++){
                           const newExpenseDate = new Date(lastExpenseDate);
                           newExpenseDate.setMonth(lastExpenseDate.getMonth() + i);
                            await Expense.create({
                                user: expense.user,
                                amount: expense.amount,
                                category: expense.category,
                                description: expense.description,
                                createdAt: newExpenseDate,
                                isRecurring: false, // Important: Don't make the generated expense recurring!
                              });
                        }
                    }

                break;

            }

        // Create the new, non-recurring expense instance
        await Expense.create({
          user: expense.user,
          amount: expense.amount,
          category: expense.category,
          description: expense.description,
          createdAt: new Date(),
          isRecurring: false, // Important: Don't make the generated expense recurring!
        });
      }
    }
    } catch(error) {
        console.error("Error processing recurring expenses", error)
    }
};

// Schedule the task (e.g., run daily at 1:00 AM)
const scheduleRecurringExpenses = () => {
    cron.schedule('0 1 * * *', () => { // 1:00 AM every day
     console.log('Running recurring expenses job...');
     mongoose.connect(process.env.MONGODB_URI).then(() => {
       processRecurringExpenses().then(() => {
         console.log('Recurring expenses processed.');
         mongoose.disconnect();
      });
     });

    });
}
module.exports = { scheduleRecurringExpenses };