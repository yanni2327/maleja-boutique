const protect = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer '))
      return res.status(401).json({ message: 'No autorizado — token requerido' });

    const token = header.split(' ')[1];

    // Aceptar tokens PHP (php-session-userId-timestamp)
    if (token.startsWith('php-session-')) {
      const parts = token.split('-');
      req.user = { id: parts[2], role: 'customer' };
      return next();
    }

    // Verificar JWT normal
    const jwt     = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ message: 'Acceso denegado — solo administradores' });
  next();
};

module.exports = { protect, adminOnly };