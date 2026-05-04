const crypto = require('crypto');

// URLs de Wompi según ambiente
const WOMPI_BASE_URL = process.env.WOMPI_ENV === 'sandbox'
  ? 'https://sandbox.wompi.co/v1'
  : 'https://production.wompi.co/v1';

// Verificar firma del webhook de Wompi
// Wompi firma los eventos con HMAC-SHA256
const verifyWompiSignature = (payload, signature) => {
  const secret = process.env.WOMPI_EVENTS_SECRET;
  const hash   = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  return hash === signature;
};

// Mapear estado de Wompi → estado interno
const mapWompiStatus = (status) => {
  const map = {
    APPROVED: 'approved',
    DECLINED: 'rejected',
    VOIDED:   'cancelled',
    ERROR:    'error',
    PENDING:  'pending'
  };
  return map[status] || 'pending';
};

module.exports = { WOMPI_BASE_URL, verifyWompiSignature, mapWompiStatus };
