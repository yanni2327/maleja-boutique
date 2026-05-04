require('dotenv').config();
const express         = require('express');
const cors            = require('cors');
const connectDB       = require('./config/db');
const productRoutes   = require('./routes/productRoutes');
const categoryRoutes  = require('./routes/categoryRoutes');

const app  = express();
const PORT = process.env.PORT || 3002;

// ── Middlewares ───────────────────────────────────
app.use(cors({
  origin: '*'
}));
app.use(express.json());

// ── Rutas ─────────────────────────────────────────
app.use('/api/products',   productRoutes);
app.use('/api/categories', categoryRoutes);

// ── Health check ──────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'products-service' }));

// ── Iniciar ───────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Products Service corriendo en http://localhost:${PORT}`);
    console.log(`📦 API Productos:   http://localhost:${PORT}/api/products`);
    console.log(`📂 API Categorías:  http://localhost:${PORT}/api/categories`);
  });
});
