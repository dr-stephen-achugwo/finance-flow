const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const PDFDocument = require('pdfkit');
const { createObjectCsvStringifier } = require('csv-writer');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/pdf', authenticate, async (req, res) => {
    try {
  const expenses = await Expense.find({ user: req.userId });
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=expenses.pdf');
  doc.pipe(res);

    expenses.forEach(exp => {
        doc.text(`${exp.description}: $${exp.amount} - ${exp.category} - ${exp.createdAt.toDateString()}`);
    });
    doc.end();
     } catch(error) {
        console.error(error);
        res.status(500).send("Error generating PDF");
    }
});

router.get('/csv', authenticate, async (req, res) => {
    try{
  const expenses = await Expense.find({ user: req.userId });

  const csvStringifier = createObjectCsvStringifier({
    header: [
      { id: 'description', title: 'Description' },
      { id: 'amount', title: 'Amount' },
      { id: 'category', title: 'Category' },
      { id: 'createdAt', title: 'Date' }
    ]
  });

    const csvData = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(expenses);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=expenses.csv');
  res.status(200).send(csvData);
    } catch(error) {
        console.error(error);
        res.status(500).send("Error generating CSV");
    }
});

module.exports = router;