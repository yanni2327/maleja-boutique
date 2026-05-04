const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  createPayment,
  wompiWebhook,
  getPaymentStatus,
  getMyPayments,
  getAllPayments
} = require('../controllers/paymentController');

// Webhook Wompi — sin autenticacion (Wompi lo llama directamente)
router.post('/webhook',              wompiWebhook);

// Cliente
router.post('/create',               protect, createPayment);
router.get('/status/:referenceCode', protect, getPaymentStatus);
router.get('/my-payments',           protect, getMyPayments);

// Admin
router.get('/admin/all',             protect, adminOnly, getAllPayments);

module.exports = router;
