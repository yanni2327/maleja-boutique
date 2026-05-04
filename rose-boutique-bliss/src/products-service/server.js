require('dotenv').config();
const express         = require('express');
const cors            = require('cors');
const connectDB       = require('./config/db');
const productRoutes   = require('./routes/productRoutes');
const categoryRoutes  = require('./routes/categoryRoutes');
const { registerService } = require('./consul');

const app  = express();
const PORT = process.env.PORT || 3002;

// ── Middlewares ───────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());

// ── Rutas ─────────────────────────────────────────
app.use('/api/products',   productRoutes);
app.use('/api/categories', categoryRoutes);

// ── Health check (requerido por Consul) ───────────
app.get('/health', (_, res) => res.json({
  status:  'ok',
  service: 'products-service',
  port:    PORT
}));

// ── Iniciar ───────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Products Service corriendo en http://localhost:${PORT}`);

    // Registrar en Consul
    registerService({
      name:      'products-service',
      id:        'products-service-1',
      port:       Number(PORT),
      healthUrl: `http://localhost:${PORT}/health`
    });
  });
});
