const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:      { type: String, required: true },   // snapshot
  price:     { type: Number, required: true },   // snapshot COP
  size:      { type: String, required: true },
  color:     { type: String, required: true },
  quantity:  { type: Number, required: true, min: 1 },
  image:     { type: String }
}, { _id: false });

const cartSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items:      [cartItemSchema],
  totalPrice: { type: Number, default: 0 }
}, { timestamps: true });

// Calcular total automáticamente antes de guardar
cartSchema.pre('save', function (next) {
  this.totalPrice = this.items.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
