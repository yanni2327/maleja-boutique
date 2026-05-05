<?php
$host     = getenv('MYSQL_HOST')     ?: 'localhost';
$port     = getenv('MYSQL_PORT')     ?: '3306';
$user     = getenv('MYSQL_USER')     ?: 'root';
$password = getenv('MYSQL_PASSWORD') ?: '';
$database = getenv('MYSQL_DATABASE') ?: 'railway';

$conexion = new mysqli($host, $user, $password, $database, (int)$port);

if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

$conexion->set_charset("utf8mb4");
?>
