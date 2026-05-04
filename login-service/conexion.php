<?php
// Conexión a MySQL — compatible con Docker y local
$host     = getenv('MYSQL_HOST')     ?: 'localhost';
$user     = getenv('MYSQL_USER')     ?: 'root';
$password = getenv('MYSQL_PASSWORD') ?: 'NuevaClave123!';
$database = getenv('MYSQL_DATABASE') ?: 'login_db';

$conexion = new mysqli($host, $user, $password, $database);

if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

$conexion->set_charset("utf8mb4");
?>
