const mongoose = require('mongoose');

const shippingAddressSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  street:     { type: String, required: true },
  city:       { type: String, required: true },
  department: { type: String, required: true },
  phone:      { type: String, required: true }
}, { _id: false });

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name:      { type: String, required: true },
  price:     { type: Number, required: true },
  size:      { type: String, required: true },
  color:     { type: String, required: true },
  quantity:  { type: Number, required: true },
  image:     { type: String }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId:          { type: String,  required: true },
  paymentId:       { type: String,  default: null },
  orderNumber:     { type: String,  unique: true },
  status: {
    type:    String,
    enum:    ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  items:           [orderItemSchema],
  subtotal:        { type: Number, required: true },
  shipping:        { type: Number, required: true, default: 0 },
  total:           { type: Number, required: true },
  shippingAddress: { type: shippingAddressSchema, required: true }
}, { timestamps: true });

// Auto-generar número de orden MAL-000001
orderSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count      = await mongoose.model('Order').countDocuments();
    this.orderNumber = `MAL-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
