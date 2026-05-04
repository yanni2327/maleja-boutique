const axios   = require('axios');
const crypto  = require('crypto');
const Payment = require('../models/Payment');
const { WOMPI_BASE_URL, verifyWompiSignature, mapWompiStatus } = require('../config/wompi');

// ── POST /api/payments/create ─────────────────────
// Crea un enlace de pago en Wompi y lo devuelve al frontend
const createPayment = async (req, res) => {
  try {
    const { orderId, total, customerEmail, customerName, customerPhone } = req.body;

    if (!orderId || !total || !customerEmail)
      return res.status(400).json({ message: 'orderId, total y customerEmail son requeridos' });

    // Wompi maneja centavos — multiplicar por 100
    const amountInCents = total * 100;

    // Referencia unica para este pago
    const referenceCode = `MALEJA-${orderId}-${Date.now()}`;

    // Generar firma de integridad requerida por Wompi
    // Formato: referenceCode + amountInCents + currency + integritySecret
    const integrityString = `${referenceCode}${amountInCents}COP${process.env.WOMPI_PRIVATE_KEY}`;
    const integritySignature = crypto
      .createHash('sha256')
      .update(integrityString)
      .digest('hex');

    // URL de pago de Wompi (checkout hosted)
    const wompiEnv = process.env.WOMPI_ENV === 'sandbox' ? 'sandbox' : 'checkout';
    const redirectUrl = `https://checkout.wompi.co/p/?public-key=${process.env.WOMPI_PUBLIC_KEY}` +
      `&currency=COP` +
      `&amount-in-cents=${amountInCents}` +
      `&reference=${referenceCode}` +
      `&redirect-url=${process.env.FRONTEND_URL}/order-response` +
      `&signature:integrity=${integritySignature}` +
      `&customer-data:email=${encodeURIComponent(customerEmail)}` +
      `&customer-data:full-name=${encodeURIComponent(customerName || '')}` +
      `&customer-data:phone-number=${encodeURIComponent(customerPhone || '')}`;

    // Guardar pago en estado pendiente
    const paymentRecord = await Payment.create({
      orderId,
      userId:        req.user.id,
      amount:        amountInCents,
      amountCOP:     total,
      referenceCode,
      redirectUrl,
      status:        'pending'
    });
    console.log('=== URL WOMPI ===', redirectUrl);
    res.json({
      message:       'Pago iniciado',
      paymentId:     paymentRecord._id,
      referenceCode,
      redirectUrl,   // ← el frontend redirige al usuario a esta URL
      amountCOP:     total
    });

  } catch (error) {
    res.status(500).json({ message: 'Error creando pago', error: error.message });
  }
};

// ── POST /api/payments/webhook ────────────────────
// Wompi llama a esta URL cuando el estado del pago cambia
const wompiWebhook = async (req, res) => {
  try {
    const { event, data, signature } = req.body;

    // Verificar que el webhook viene de Wompi
    if (!verifyWompiSignature(req.body, signature?.checksum)) {
      console.warn('⚠️  Firma invalida en webhook Wompi');
      return res.sendStatus(401);
    }

    if (event === 'transaction.updated') {
      const transaction = data.transaction;
      const status      = mapWompiStatus(transaction.status);

      // Actualizar pago en la BD
      const paymentRecord = await Payment.findOneAndUpdate(
        { referenceCode: transaction.reference },
        {
          status,
          wompiTransId:    transaction.id,
          method:          transaction.payment_method_type,
          gatewayResponse: transaction,
          paidAt:          status === 'approved' ? new Date() : null
        },
        { new: true }
      );

      // Notificar al Orders Service si el pago fue aprobado
      if (status === 'approved' && paymentRecord) {
        await axios.put(
          `${process.env.ORDERS_SERVICE_URL}/api/orders/${paymentRecord.orderId}/payment`,
          { paymentId: paymentRecord._id }
        );
        console.log(`✅ Pedido ${paymentRecord.orderId} marcado como pagado via Wompi`);
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Error en webhook Wompi:', error.message);
    res.sendStatus(500);
  }
};

// ── GET /api/payments/status/:referenceCode ───────
// El frontend consulta el estado despues del redirect
const getPaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findOne({ referenceCode: req.params.referenceCode });
    if (!payment) return res.status(404).json({ message: 'Pago no encontrado' });

    // Consultar estado actualizado en Wompi
    try {
      const { data } = await axios.get(
        `${WOMPI_BASE_URL}/transactions?reference=${req.params.referenceCode}`,
        { headers: { Authorization: `Bearer ${process.env.WOMPI_PRIVATE_KEY}` } }
      );
      if (data.data?.length > 0) {
        const tx     = data.data[0];
        const status = mapWompiStatus(tx.status);
        if (payment.status !== status) {
          payment.status          = status;
          payment.wompiTransId    = tx.id;
          payment.method          = tx.payment_method_type;
          payment.gatewayResponse = tx;
          if (status === 'approved') payment.paidAt = new Date();
          await payment.save();
        }
      }
    } catch {
      // Si no se puede consultar Wompi, devolver el estado local
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error consultando pago', error: error.message });
  }
};

// ── GET /api/payments/my-payments ────────────────
const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo pagos', error: error.message });
  }
};

// ── GET /api/payments/admin/all ───────────────────
const getAllPayments = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter   = status ? { status } : {};
    const skip     = (page - 1) * limit;
    const payments = await Payment.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 });
    const total    = await Payment.countDocuments(filter);
    res.json({ payments, total, page: Number(page) });
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo pagos', error: error.message });
  }
};

module.exports = { createPayment, wompiWebhook, getPaymentStatus, getMyPayments, getAllPayments };
