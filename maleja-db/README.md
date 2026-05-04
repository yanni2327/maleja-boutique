# 🌸 Maleja Women Boutique — Base de Datos MongoDB

## Estructura del proyecto

```
maleja-db/
├── docker-compose.yml       # MongoDB + Mongo Express
├── .env                     # Variables de entorno
├── init/
│   └── mongo-init.js        # Crea colecciones e índices al iniciar
├── config/
│   └── db.js                # Conexión Mongoose
├── models/
│   ├── User.js
│   ├── Category.js
│   ├── Product.js
│   ├── Review.js
│   ├── Cart.js
│   ├── Order.js
│   └── Payment.js
├── seeds/
│   └── seed.js              # Datos iniciales
└── package.json
```

---

## ▶️ Comandos paso a paso

### 1. Levantar MongoDB con Docker
```bash
docker-compose up -d
```

### 2. Verificar que los contenedores están corriendo
```bash
docker ps
```
Deberías ver dos contenedores activos:
- `maleja_mongodb` → puerto 27017
- `maleja_mongo_express` → puerto 8081

### 3. Ver los logs de MongoDB
```bash
docker logs maleja_mongodb
```

### 4. Instalar dependencias de Node
```bash
npm install
```

### 5. Cargar datos iniciales (categorías y productos)
```bash
npm run seed
```

---

## 🌐 Panel visual — Mongo Express

Abre en tu navegador:
```
http://localhost:8081
```
- **Usuario:** admin
- **Contraseña:** admin123

Desde aquí puedes ver, crear, editar y eliminar documentos visualmente.

---

## 🔌 Cadena de conexión para los microservicios

Copia esta variable en el `.env` de cada microservicio:

```env
MONGO_URI=mongodb://maleja_app:MalejaApp2024!@localhost:27017/maleja_db?authSource=maleja_db
```

---

## ⏹️ Comandos útiles de Docker

```bash
# Detener los contenedores (sin borrar datos)
docker-compose stop

# Volver a iniciar
docker-compose start

# Detener Y eliminar contenedores (los datos en el volumen se conservan)
docker-compose down

# ⚠️  Eliminar TODO incluyendo los datos guardados
docker-compose down -v

# Entrar a la consola de MongoDB
docker exec -it maleja_mongodb mongosh \
  -u maleja_admin -p MalejaSecure2024! --authenticationDatabase admin
```

---

## 📋 Colecciones creadas

| Colección    | Microservicio    | Índices principales              |
|--------------|-----------------|----------------------------------|
| users        | Users Service   | email (único)                    |
| products     | Products Service| category, isActive, text search  |
| categories   | Products Service| slug (único)                     |
| reviews      | Products Service| productId, userId                |
| carts        | Orders Service  | userId (único)                   |
| orders       | Orders Service  | userId, orderNumber, status      |
| payments     | Payments Service| orderId, gatewayTxId (único)     |
