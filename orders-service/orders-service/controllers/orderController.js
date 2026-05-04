const Order = require('../models/Order');
const Cart  = require('../models/Cart');

// ── POST /api/orders ──────────────────────────────
// Crear pedido desde el carrito actual
const createOrder = async (req, res) => {
  try {
    const { shippingAddress, shippingCost = 0 } = req.body;

    if (!shippingAddress)
      return res.status(400).json({ message: 'Dirección de envío requerida' });

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: 'El carrito está vacío' });

    const subtotal = cart.totalPrice;
    const total    = subtotal + shippingCost;

    const order = await Order.create({
      userId:          req.user.id,
      items:           cart.items,
      subtotal,
      shipping:        shippingCost,
      total,
      shippingAddress
    });

    // Vaciar carrito después de crear el pedido
    await Cart.findOneAndDelete({ userId: req.user.id });

    res.status(201).json({ message: 'Pedido creado', order });
  } catch (error) {
    res.status(500).json({ message: 'Error creando pedido', error: error.message });
  }
};

// ── GET /api/orders ───────────────────────────────
// Pedidos del usuario autenticado
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo pedidos', error: error.message });
  }
};

// ── GET /api/orders/:id ───────────────────────────
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });

    // Solo el dueño o un admin puede verlo
    if (order.userId !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'No autorizado' });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo pedido', error: error.message });
  }
};

// ── GET /api/orders/admin/all (admin) ─────────────
const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = status ? { status } : {};
    const skip   = (page - 1) * limit;

    const orders = await Order.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 });
    const total  = await Order.countDocuments(filter);

    res.json({ orders, total, page: Number(page) });
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo pedidos', error: error.message });
  }
};

// ── PUT /api/orders/:id/status (admin) ───────────
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status))
      return res.status(400).json({ message: 'Estado inválido' });

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });

    res.json({ message: 'Estado actualizado', order });
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando estado', error: error.message });
  }
};

// ── PUT /api/orders/:id/payment ───────────────────
// Llamado por Payments Service para marcar pedido como pagado
const markOrderPaid = async (req, res) => {
  try {
    const { paymentId } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'paid', paymentId },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });
    res.json({ message: 'Pedido marcado como pagado', order });
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando pago', error: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, markOrderPaid };
