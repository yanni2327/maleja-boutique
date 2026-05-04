const mongoose = require('mongoose');

const shippingAddressSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  street:     { type: String, required: true },
  city:       { type: String, required: true },
  department: { type: String, required: true },
  phone:      { type: String, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User',    required: true },
  paymentId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  orderNumber:     { type: String, unique: true },
  status:          {
    type:    String,
    enum:    ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  items:           { type: Array,  required: true },  // snapshot del carrito
  subtotal:        { type: Number, required: true },  // COP
  shipping:        { type: Number, required: true, default: 0 },
  total:           { type: Number, required: true },  // COP
  shippingAddress: { type: shippingAddressSchema, required: true }
}, { timestamps: true });

// Auto-generar número de orden tipo MAL-000001
orderSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `MAL-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
