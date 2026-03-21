const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const productRoutes = require('./src/routes/product.routes');
const inventoryRoutes = require('./src/routes/inventory.routes');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

module.exports = app;
