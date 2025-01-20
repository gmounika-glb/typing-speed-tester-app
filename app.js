const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const authRoutes = require('./routes/auth');
const historyRoutes = require('./routes/history');
const dotenv = require('dotenv');
const path = require('path');
// Load environment variables from .env
dotenv.config();
const app = express();
// const PORT = 5678;

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/typingSpeedDB')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(bodyParser.json());
// app.use(express.static('public')); // Serve frontend
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Serve static files (like HTML, CSS, JS) if needed
app.use(express.static(path.join(__dirname, 'public')));

// Dynamic port assignment for Heroku
const PORT = process.env.PORT || 5678;
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/history', historyRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
