const Cart = require('../models/Cart');

// ── GET /api/cart ─────────────────────────────────
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }) || { items: [], totalPrice: 0 };
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo carrito', error: error.message });
  }
};

// ── POST /api/cart ────────────────────────────────
// Agregar o actualizar un ítem en el carrito
const addToCart = async (req, res) => {
  try {
    const { productId, name, price, size, color, quantity, image } = req.body;

    if (!productId || !name || !price || !size || !color || !quantity)
      return res.status(400).json({ message: 'Todos los campos del ítem son requeridos' });

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) cart = new Cart({ userId: req.user.id, items: [] });

    // Si el mismo producto con misma talla y color ya está, sumar cantidad
    const existingIndex = cart.items.findIndex(
      i => i.productId.toString() === productId && i.size === size && i.color === color
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, name, price, size, color, quantity, image });
    }

    await cart.save();
    res.json({ message: 'Ítem agregado al carrito', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error agregando al carrito', error: error.message });
  }
};

// ── PUT /api/cart/:productId ──────────────────────
// Actualizar cantidad de un ítem
const updateCartItem = async (req, res) => {
  try {
    const { quantity, size, color } = req.body;
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

    const item = cart.items.find(
      i => i.productId.toString() === req.params.productId && i.size === size && i.color === color
    );
    if (!item) return res.status(404).json({ message: 'Ítem no encontrado en el carrito' });

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        i => !(i.productId.toString() === req.params.productId && i.size === size && i.color === color)
      );
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    res.json({ message: 'Carrito actualizado', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando carrito', error: error.message });
  }
};

// ── DELETE /api/cart ──────────────────────────────
// Vaciar carrito
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user.id });
    res.json({ message: 'Carrito vaciado' });
  } catch (error) {
    res.status(500).json({ message: 'Error vaciando carrito', error: error.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, clearCart };
