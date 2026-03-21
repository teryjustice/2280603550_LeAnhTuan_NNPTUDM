const Product = require('../models/product.model');

// POST /api/products — Tạo product (tự động tạo inventory qua hook)
const createProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const product = await Product.create({ name, price, description });
    return res.status(201).json({
      message: 'Product created successfully. Inventory has been initialized.',
      data: product,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// GET /api/products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json({ data: products });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.status(200).json({ data: product });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { createProduct, getAllProducts, getProductById };
