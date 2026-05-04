const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name:      { type: String,  required: true },  // snapshot
  price:     { type: Number,  required: true },  // snapshot COP
  size:      { type: String,  required: true },
  color:     { type: String,  required: true },
  quantity:  { type: Number,  required: true, min: 1 },
  image:     { type: String }
}, { _id: false });

const cartSchema = new mongoose.Schema({
  userId:     { type: String, required: true, unique: true },  // viene del JWT
  items:      [cartItemSchema],
  totalPrice: { type: Number, default: 0 }
}, { timestamps: true });

// Calcular total automáticamente
cartSchema.pre('save', function (next) {
  this.totalPrice = this.items.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
