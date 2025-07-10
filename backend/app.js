const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const documentRoutes = require('./routes/documentRoutes');
const characterRoutes = require('./routes/character.route');

// Create Express app
const app = express();

const MONGO_DB=process.env.MONGO_URI || 'mongodb://localhost:27017/dialog';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Routes
app.use('/api', documentRoutes);
// app.use('/character', characterRoutes);

// Serve React app (for production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
