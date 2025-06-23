const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
db_url = process.env.MONGO_URI || 'mongodb://localhost:27017/notesapp';
app.get('/', (req, res) => {
  res.send('Notes Manager API is running');
});

// Connect to MongoDB
mongoose.connect(db_url)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes); 