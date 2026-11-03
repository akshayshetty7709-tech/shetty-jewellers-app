const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, index: true },
  metal: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, default: '' },
  image: { type: String, required: true },
  gender: { type: String, default: 'Unisex' },
  featured: { type: Boolean, default: false },
  stock: { type: Number, default: 10, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
