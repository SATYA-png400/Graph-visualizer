const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const graphRoutes = require('./routes/graphRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/graphs', graphRoutes);

// MongoDB Connection
// Using a default local MongoDB URI if not provided in .env
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/graph-visualizer';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });
