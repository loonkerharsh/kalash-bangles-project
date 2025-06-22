
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mainRoutes = require('./routes/index');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;
const allowedOrigins = [
  'http://localhost:4173',
  'http://localhost:4174',
];
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., curl or mobile app), or if it's in the allowedOrigins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS not allowed for this origin: ${origin}`));
    }
  },
}));


// Body Parsers
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Serve static files (uploaded images)
// Images will be accessible via http://localhost:3001/images/categories/filename.jpg etc.
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// API Routes
app.use('/api', mainRoutes);

// Global Error Handler
app.use(errorHandler);

// Test route
app.get('/', (req, res) => {
  res.send('Kalash Bangles API is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on ${process.env.API_URL || `http://localhost:${PORT}`}`);
  console.log(`Allowing CORS for: ${allowedOrigins.join(', ')}`);
});

