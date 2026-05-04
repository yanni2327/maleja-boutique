const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  createOrder, getMyOrders, getOrderById,
  getAllOrders, updateOrderStatus, markOrderPaid
} = require('../controllers/orderController');

// Cliente
router.post('/',    protect, createOrder);
router.get('/',     protect, getMyOrders);
router.get('/:id',  protect, getOrderById);

// Admin
router.get('/admin/all',          protect, adminOnly, getAllOrders);
router.put('/:id/status',         protect, adminOnly, updateOrderStatus);

// Interno — llamado por Payments Service
router.put('/:id/payment', markOrderPaid);

module.exports = router;
