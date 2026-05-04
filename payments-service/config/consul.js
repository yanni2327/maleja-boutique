const http = require('http');

const registerService = ({ name, id, port }) => {
  const CONSUL_HOST = process.env.CONSUL_HOST || 'localhost';
  const CONSUL_PORT = process.env.CONSUL_PORT || 8500;

  const serviceData = JSON.stringify({
    ID:      id,
    Name:    name,
    Address: 'host.docker.internal',
    Port:    port,
    Tags:    ['maleja', 'boutique', name],
    Check: {
      HTTP:                           `http://host.docker.internal:${port}/health`,
      Interval:                       '15s',
      Timeout:                        '5s',
      DeregisterCriticalServiceAfter: '30s'
    }
  });

  const options = {
    hostname: CONSUL_HOST, port: CONSUL_PORT,
    path: '/v1/agent/service/register', method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(serviceData) }
  };

  const req = http.request(options, (res) => {
    if (res.statusCode === 200)
      console.log(`✅ [Consul] ${name} registrado en http://${CONSUL_HOST}:${CONSUL_PORT}`);
    else
      console.warn(`⚠️  [Consul] Registro devolvio status ${res.statusCode}`);
  });
  req.on('error', () => console.warn('⚠️  [Consul] No se pudo conectar — corriendo sin descubrimiento'));
  req.write(serviceData);
  req.end();

  const deregister = () => {
    const opts = { hostname: CONSUL_HOST, port: CONSUL_PORT, path: `/v1/agent/service/deregister/${id}`, method: 'PUT' };
    const dreq = http.request(opts, () => { console.log(`🔴 [Consul] ${name} desregistrado`); process.exit(0); });
    dreq.on('error', () => process.exit(0));
    dreq.end();
  };
  process.on('SIGINT', deregister);
  process.on('SIGTERM', deregister);
};

module.exports = { registerService };
