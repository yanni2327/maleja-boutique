const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId:         { type: String, required: true },
  userId:          { type: String, required: true },
  amount:          { type: Number, required: true },     // COP (en centavos para Wompi)
  amountCOP:       { type: Number, required: true },     // COP legible
  referenceCode:   { type: String, required: true, unique: true },
  gateway:         { type: String, default: 'wompi' },
  wompiTransId:    { type: String, default: null },      // ID de transaccion Wompi
  status: {
    type:    String,
    enum:    ['pending', 'approved', 'rejected', 'cancelled', 'error', 'refunded'],
    default: 'pending'
  },
  method:          { type: String, default: null },      // CARD, NEQUI, PSE, BANCOLOMBIA_TRANSFER
  gatewayResponse: { type: mongoose.Schema.Types.Mixed },
  redirectUrl:     { type: String, default: null },      // URL de pago Wompi
  paidAt:          { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
