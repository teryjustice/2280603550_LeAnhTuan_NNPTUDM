const express = require('express');
const router = express.Router();
const Role = require('../models/Role');
const User = require('../models/User');

// Create role (for testing)
router.post('/', async (req, res) => {
  try {
    const role = new Role(req.body);
    await role.save();
    res.status(201).json(role);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all roles
router.get('/', async (req, res) => {
  try {
    const roles = await Role.find({ isDeleted: false });
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get role by id
router.get('/:id', async (req, res) => {
  try {
    const role = await Role.findOne({ _id: req.params.id, isDeleted: false });
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json(role);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update role
router.put('/:id', async (req, res) => {
  try {
    const role = await Role.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true }
    );
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json(role);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Soft delete role
router.delete('/:id', async (req, res) => {
  try {
    const role = await Role.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json({ message: 'Role soft deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all users with specific role
router.get('/:id/users', async (req, res) => {
  try {
    const users = await User.find({ role: req.params.id, isDeleted: false }).populate('role');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;