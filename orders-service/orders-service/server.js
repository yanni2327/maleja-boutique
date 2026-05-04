require('dotenv').config();
const express     = require('express');
const cors        = require('cors');
const connectDB   = require('./config/db');
const cartRoutes  = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const { registerService } = require('./consul');

const app  = express();
const PORT = process.env.PORT || 3003;

// ── Middlewares ───────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());

// ── Rutas ─────────────────────────────────────────
app.use('/api/cart',   cartRoutes);
app.use('/api/orders', orderRoutes);

// ── Health check (requerido por Consul) ───────────
app.get('/health', (_, res) => res.json({
  status:  'ok',
  service: 'orders-service',
  port:    PORT
}));

// ── Iniciar ───────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Orders Service corriendo en http://localhost:${PORT}`);

    // Registrar en Consul
    registerService({
      name:      'orders-service',
      id:        'orders-service-1',
      port:       Number(PORT),
      healthUrl: `http://localhost:${PORT}/health`
    });
  });
});
