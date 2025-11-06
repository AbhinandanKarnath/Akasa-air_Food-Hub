require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const inventoryRoutes = require('./routes/inventory');
const orderRoutes = require('./routes/orders');
const profileRoutes = require('./routes/profile');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/profile', profileRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Food Ordering Platform Backend API',
    status: 'Connected',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});