const mongoose = require('mongoose');
const Inventory = require('./inventory.model');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price must be >= 0'],
    },
    description: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// ─── Post-save hook: tự động tạo Inventory khi tạo Product mới ───────────────
productSchema.post('save', async function (doc) {
  try {
    const exists = await Inventory.findOne({ product: doc._id });
    if (!exists) {
      await Inventory.create({ product: doc._id });
      console.log(`📦 Inventory created for product: ${doc.name}`);
    }
  } catch (err) {
    console.error('❌ Error creating inventory for product:', err.message);
  }
});

module.exports = mongoose.model('Product', productSchema);
