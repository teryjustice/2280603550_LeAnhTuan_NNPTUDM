const Inventory = require('../models/inventory.model');

// ─── GET /api/inventory ──────────────────────────────────────────────────────
const getAll = async (req, res) => {
  try {
    const inventories = await Inventory.find().populate('product');
    return res.status(200).json({ data: inventories });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ─── GET /api/inventory/:id ──────────────────────────────────────────────────
const getById = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id).populate('product');
    if (!inventory) return res.status(404).json({ message: 'Inventory not found' });
    return res.status(200).json({ data: inventory });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ─── POST /api/inventory/add-stock ──────────────────────────────────────────
// Body: { product: <productId>, quantity: <number> }
// Tăng stock tương ứng với quantity
const addStock = async (req, res) => {
  try {
    const { product, quantity } = req.body;
    if (!product || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'product and quantity (> 0) are required' });
    }

    const inventory = await Inventory.findOneAndUpdate(
      { product },
      { $inc: { stock: quantity } },
      { new: true, runValidators: true }
    ).populate('product');

    if (!inventory) return res.status(404).json({ message: 'Inventory not found for this product' });

    return res.status(200).json({
      message: `Stock increased by ${quantity}`,
      data: inventory,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// ─── POST /api/inventory/remove-stock ───────────────────────────────────────
// Body: { product: <productId>, quantity: <number> }
// Giảm stock tương ứng với quantity
const removeStock = async (req, res) => {
  try {
    const { product, quantity } = req.body;
    if (!product || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'product and quantity (> 0) are required' });
    }

    const inventory = await Inventory.findOne({ product });
    if (!inventory) return res.status(404).json({ message: 'Inventory not found for this product' });

    if (inventory.stock < quantity) {
      return res.status(400).json({
        message: `Not enough stock. Available: ${inventory.stock}, Requested: ${quantity}`,
      });
    }

    inventory.stock -= quantity;
    await inventory.save();
    await inventory.populate('product');

    return res.status(200).json({
      message: `Stock decreased by ${quantity}`,
      data: inventory,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// ─── POST /api/inventory/reservation ────────────────────────────────────────
// Body: { product: <productId>, quantity: <number> }
// Giảm stock và tăng reserved tương ứng với quantity
const reservation = async (req, res) => {
  try {
    const { product, quantity } = req.body;
    if (!product || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'product and quantity (> 0) are required' });
    }

    const inventory = await Inventory.findOne({ product });
    if (!inventory) return res.status(404).json({ message: 'Inventory not found for this product' });

    if (inventory.stock < quantity) {
      return res.status(400).json({
        message: `Not enough stock to reserve. Available: ${inventory.stock}, Requested: ${quantity}`,
      });
    }

    inventory.stock -= quantity;
    inventory.reserved += quantity;
    await inventory.save();
    await inventory.populate('product');

    return res.status(200).json({
      message: `Reserved ${quantity} unit(s). Stock decreased, reserved increased.`,
      data: inventory,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// ─── POST /api/inventory/sold ────────────────────────────────────────────────
// Body: { product: <productId>, quantity: <number> }
// Giảm reserved và tăng soldCount tương ứng với quantity
const sold = async (req, res) => {
  try {
    const { product, quantity } = req.body;
    if (!product || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'product and quantity (> 0) are required' });
    }

    const inventory = await Inventory.findOne({ product });
    if (!inventory) return res.status(404).json({ message: 'Inventory not found for this product' });

    if (inventory.reserved < quantity) {
      return res.status(400).json({
        message: `Not enough reserved stock to mark as sold. Reserved: ${inventory.reserved}, Requested: ${quantity}`,
      });
    }

    inventory.reserved -= quantity;
    inventory.soldCount += quantity;
    await inventory.save();
    await inventory.populate('product');

    return res.status(200).json({
      message: `Sold ${quantity} unit(s). Reserved decreased, soldCount increased.`,
      data: inventory,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = { getAll, getById, addStock, removeStock, reservation, sold };
