const http = require('http');

/**
 * Registra este microservicio en Consul al arrancar
 * y lo desregistra cuando el proceso se cierra.
 *
 * @param {object} options
 * @param {string} options.name      - Nombre del servicio (ej: 'products-service')
 * @param {string} options.id        - ID único (ej: 'products-service-1')
 * @param {number} options.port      - Puerto donde corre el servicio
 * @param {string} options.healthUrl - URL del health check (ej: 'http://localhost:3002/health')
 */
const registerService = ({ name, id, port, healthUrl }) => {
  const CONSUL_HOST = process.env.CONSUL_HOST || 'localhost';
  const CONSUL_PORT = process.env.CONSUL_PORT || 8500;

  const serviceData = JSON.stringify({
    ID:      id,
    Name:    name,
    Address: 'host.docker.internal',  // dirección del host Windows desde Docker
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
    hostname: CONSUL_HOST,
    port:     CONSUL_PORT,
    path:     '/v1/agent/service/register',
    method:   'PUT',
    headers: {
      'Content-Type':   'application/json',
      'Content-Length': Buffer.byteLength(serviceData)
    }
  };

  const req = http.request(options, (res) => {
    if (res.statusCode === 200) {
      console.log(`✅ [Consul] ${name} registrado en http://${CONSUL_HOST}:${CONSUL_PORT}`);
    } else {
      console.warn(`⚠️  [Consul] Registro devolvió status ${res.statusCode}`);
    }
  });

  req.on('error', () => {
    console.warn(`⚠️  [Consul] No se pudo conectar — el servicio correrá sin descubrimiento`);
  });

  req.write(serviceData);
  req.end();

  // Desregistrar limpiamente al apagar el proceso
  const deregister = () => {
    const deregOpts = {
      hostname: CONSUL_HOST,
      port:     CONSUL_PORT,
      path:     `/v1/agent/service/deregister/${id}`,
      method:   'PUT'
    };
    const dreq = http.request(deregOpts, () => {
      console.log(`🔴 [Consul] ${name} desregistrado`);
      process.exit(0);
    });
    dreq.on('error', () => process.exit(0));
    dreq.end();
  };

  process.on('SIGINT',  deregister);
  process.on('SIGTERM', deregister);
};

/**
 * Descubrir la URL de otro microservicio preguntándole a Consul
 * @param {string} serviceName - Nombre del servicio a buscar
 * @returns {Promise<string>} - URL base del servicio (ej: 'http://localhost:3002')
 */
const discoverService = (serviceName) => {
  const CONSUL_HOST = process.env.CONSUL_HOST || 'localhost';
  const CONSUL_PORT = process.env.CONSUL_PORT || 8500;

  return new Promise((resolve, reject) => {
    const options = {
      hostname: CONSUL_HOST,
      port:     CONSUL_PORT,
      path:     `/v1/catalog/service/${serviceName}`,
      method:   'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const services = JSON.parse(data);
          if (!services || services.length === 0) {
            return reject(new Error(`[Consul] Servicio '${serviceName}' no encontrado`));
          }
          const svc = services[0];
          const url = `http://${svc.ServiceAddress || 'localhost'}:${svc.ServicePort}`;
          console.log(`🔍 [Consul] ${serviceName} encontrado en ${url}`);
          resolve(url);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
};

module.exports = { registerService, discoverService };
