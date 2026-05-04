CREATE DATABASE IF NOT EXISTS login_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE login_db;

CREATE TABLE IF NOT EXISTS usuarios (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    nombre     VARCHAR(100)  NOT NULL,
    correo     VARCHAR(150)  NOT NULL UNIQUE,
    usuario    VARCHAR(50)   NOT NULL UNIQUE,
    password   VARCHAR(255)  NOT NULL,
    role       VARCHAR(20)   NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS password_resets (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    correo     VARCHAR(150)  NOT NULL,
    token      VARCHAR(255)  NOT NULL,
    created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP     DEFAULT (CURRENT_TIMESTAMP + INTERVAL 1 HOUR)
);

-- Usuario administrador
INSERT INTO usuarios (nombre, correo, usuario, password, role)
VALUES ('Administrador', 'admin@maleja.com', 'admin', 'admin123', 'admin')
ON DUPLICATE KEY UPDATE role = 'admin';

SELECT 'login_db inicializada correctamente' AS mensaje;
