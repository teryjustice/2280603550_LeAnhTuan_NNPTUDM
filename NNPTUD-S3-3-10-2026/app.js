const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/nnptud', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Database connection error:', err));

const userRoutes = require('./routes/user');
const roleRoutes = require('./routes/role');

app.use('/users', userRoutes);
app.use('/roles', roleRoutes);

// Seed data route for testing
app.post('/seed', async (req, res) => {
  try {
    const Role = require('./models/Role');
    const User = require('./models/User');

    // Delete all existing data
    await Role.deleteMany({});
    await User.deleteMany({});

    // Create a role
    const role = new Role({ name: 'admin', description: 'Administrator role' });
    await role.save();

    // Create users
    const user1 = new User({
      username: 'admin',
      password: 'password123',
      email: 'admin@example.com',
      fullName: 'Admin User',
      role: role._id,
      status: true
    });
    await user1.save();

    const user2 = new User({
      username: 'testuser',
      password: 'password123',
      email: 'test@example.com',
      fullName: 'Test User',
      role: role._id,
      status: false
    });
    await user2.save();

    res.json({
      message: 'Seed data created successfully',
      role: role,
      users: [user1, user2]
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});