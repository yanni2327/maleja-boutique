const crypto = require('crypto');

// URLs de PayU según ambiente
const PAYU_GATEWAY_URL = process.env.PAYU_ENV === 'sandbox'
  ? 'https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi'
  : 'https://api.payulatam.com/payments-api/4.0/service.cgi';

const PAYU_CHECKOUT_URL = process.env.PAYU_ENV === 'sandbox'
  ? 'https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu'
  : 'https://checkout.payulatam.com/ppp-web-gateway-payu';

// Generar firma MD5 para el checkout de PayU
// Formato: apiKey~merchantId~referenceCode~amount~currency
const generateSignature = (referenceCode, amount, currency = 'COP') => {
  const str = `${process.env.PAYU_API_KEY}~${process.env.PAYU_MERCHANT_ID}~${referenceCode}~${amount}~${currency}`;
  return crypto.createHash('md5').update(str).digest('hex');
};

// Verificar firma del webhook de confirmación PayU
// Formato: apiKey~merchantId~referenceCode~TX_VALUE~currency~transactionState
const verifyWebhookSignature = ({ apiKey, merchantId, referenceCode, TX_VALUE, currency, transactionState, sign }) => {
  const str  = `${apiKey}~${merchantId}~${referenceCode}~${TX_VALUE}~${currency}~${transactionState}`;
  const hash = crypto.createHash('md5').update(str).digest('hex');
  return hash === sign;
};

module.exports = { PAYU_GATEWAY_URL, PAYU_CHECKOUT_URL, generateSignature, verifyWebhookSignature };
