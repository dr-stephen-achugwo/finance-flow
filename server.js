require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const goalRoutes = require('./routes/goalRoutes');
const shareRoutes = require('./routes/shareRoutes');
const aiRoutes = require('./routes/aiRoutes');
const exportRoutes = require('./routes/exportRoutes');
const {scheduleRecurringExpenses} = require('./cron/recurringExpenses');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Be more restrictive in production
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Add io to request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/export', exportRoutes);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  scheduleRecurringExpenses();
});