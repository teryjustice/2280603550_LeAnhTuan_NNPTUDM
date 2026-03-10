const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create user (for testing)
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /enable (must be before /:id route)
router.post('/enable', async (req, res) => {
  try {
    const { email, username } = req.body;
    const user = await User.findOneAndUpdate(
      { email, username, isDeleted: false },
      { status: true },
      { new: true }
    ).populate('role');
    if (!user) return res.status(404).json({ message: 'User not found or invalid credentials' });
    res.json({ message: 'User enabled', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /disable (must be before /:id route)
router.post('/disable', async (req, res) => {
  try {
    const { email, username } = req.body;
    const user = await User.findOneAndUpdate(
      { email, username, isDeleted: false },
      { status: false },
      { new: true }
    ).populate('role');
    if (!user) return res.status(404).json({ message: 'User not found or invalid credentials' });
    res.json({ message: 'User disabled', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all users, with query username includes
router.get('/', async (req, res) => {
  try {
    let query = { isDeleted: false };
    if (req.query.username) {
      query.username = { $regex: req.query.username, $options: 'i' };
    }
    const users = await User.find(query).populate('role');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user by id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isDeleted: false }).populate('role');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true }
    ).populate('role');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Soft delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User soft deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;