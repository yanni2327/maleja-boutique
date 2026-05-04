const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  size:  { type: String, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], required: true },
  color: { type: String, required: true },
  stock: { type: Number, required: true, min: 0, default: 0 },
  sku:   { type: String, required: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price:       { type: Number, required: true, min: 0 },
  category:    { type: String, required: true },
  images:      [{ type: String }],   // URLs de Cloudinary
  badges:      [{ type: String, enum: ['Nuevo', 'Bestseller', 'Oferta'] }],
  variants:    [variantSchema],
  isActive:    { type: Boolean, default: true }
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
