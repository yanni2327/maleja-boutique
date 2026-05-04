// ── Inicialización de maleja_db ─────────────────────
db = db.getSiblingDB('maleja_db');

// Usuario de la aplicación (solo acceso a maleja_db)
db.createUser({
  user: 'maleja_app',
  pwd:  'MalejaApp2024!',
  roles: [{ role: 'readWrite', db: 'maleja_db' }]
});

// ── Crear colecciones ───────────────────────────────
db.createCollection('users');
db.createCollection('products');
db.createCollection('categories');
db.createCollection('reviews');
db.createCollection('carts');
db.createCollection('orders');
db.createCollection('payments');

// ── Índices: users ──────────────────────────────────
db.users.createIndex({ email: 1 }, { unique: true });

// ── Índices: products ───────────────────────────────
db.products.createIndex({ category: 1 });
db.products.createIndex({ isActive: 1 });
db.products.createIndex({ name: 'text', description: 'text' });

// ── Índices: categories ─────────────────────────────
db.categories.createIndex({ slug: 1 }, { unique: true });

// ── Índices: reviews ────────────────────────────────
db.reviews.createIndex({ productId: 1 });
db.reviews.createIndex({ userId: 1 });

// ── Índices: carts ──────────────────────────────────
db.carts.createIndex({ userId: 1 }, { unique: true });

// ── Índices: orders ─────────────────────────────────
db.orders.createIndex({ userId: 1 });
db.orders.createIndex({ orderNumber: 1 }, { unique: true });
db.orders.createIndex({ status: 1 });

// ── Índices: payments ───────────────────────────────
db.payments.createIndex({ orderId: 1 });
db.payments.createIndex({ gatewayTxId: 1 }, { unique: true });

print('✅ maleja_db inicializada con 7 colecciones e índices');
