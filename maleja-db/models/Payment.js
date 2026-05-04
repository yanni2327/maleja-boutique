const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId:         { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User',  required: true },
  amount:          { type: Number, required: true },   // COP
  gateway:         { type: String, enum: ['stripe', 'mercadopago', 'payu'], required: true },
  gatewayTxId:     { type: String, required: true, unique: true },
  status:          {
    type:    String,
    enum:    ['pending', 'approved', 'rejected', 'cancelled', 'refunded'],
    default: 'pending'
  },
  method:          { type: String, enum: ['card', 'nequi', 'pse', 'cash', 'transfer'] },
  gatewayResponse: { type: mongoose.Schema.Types.Mixed },  // raw webhook
  paidAt:          { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
