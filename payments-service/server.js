require('dotenv').config();
const express          = require('express');
const cors             = require('cors');
const connectDB        = require('./config/db');
const paymentRoutes    = require('./routes/paymentRoutes');
const { registerService } = require('./config/consul');

const app  = express();
const PORT = process.env.PORT || 3004;

// ── Middlewares ───────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Rutas ─────────────────────────────────────────
app.use('/api/payments', paymentRoutes);

// ── Health check ──────────────────────────────────
app.get('/health', (_, res) => res.json({
  status:  'ok',
  service: 'payments-service',
  gateway: 'Wompi Colombia',
  env:     process.env.WOMPI_ENV || 'sandbox'
}));

// ── Iniciar ───────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Payments Service corriendo en http://localhost:${PORT}`);
    console.log(`💳 Gateway: Wompi ${process.env.WOMPI_ENV === 'sandbox' ? '(Sandbox)' : '(Produccion)'}`);
    console.log(`🔗 API: http://localhost:${PORT}/api/payments`);

    registerService({
      name: 'payments-service',
      id:   'payments-service-1',
      port: Number(PORT)
    });
  });
});
