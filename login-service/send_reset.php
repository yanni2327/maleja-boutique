<?php
include('conexion.php');
// Habilitar reporte de errores para depuración temporal
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: forgot.php');
    exit;
}

$email = $conexion->real_escape_string(trim($_POST['email']));

// Verificar que el usuario exista
$res = $conexion->query("SELECT * FROM usuarios WHERE correo='$email'");
if ($res->num_rows == 0) {
    echo "<script>alert('No existe una cuenta con ese correo.'); window.location='forgot.php';</script>";
    exit;
}

// Asegurar tabla de tokens
$create = "CREATE TABLE IF NOT EXISTS password_resets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    correo VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
$conexion->query($create);

// Generar token
try {
    $token = bin2hex(random_bytes(16));
} catch (Exception $e) {
    $token = bin2hex(openssl_random_pseudo_bytes(16));
}
$expires = date('Y-m-d H:i:s', time() + 3600); // 1 hora

// Insertar token
$stmt = $conexion->prepare("INSERT INTO password_resets (correo, token, expires_at) VALUES (?, ?, ?)");
$stmt->bind_param('sss', $email, $token, $expires);
$stmt->execute();
$execErr = $stmt->error;
$stmt->close();

if ($execErr) {
    echo "<p>Error al insertar token: " . htmlspecialchars($execErr) . "</p>";
}

$reset_link = "http://localhost/Login/reset.php?token={$token}";

// Intentar enviar correo
$subject = "Restablecer contraseña";
$message = "Haz clic en el siguiente enlace para restablecer tu contraseña:\n\n" . $reset_link . "\n\nSi no solicitaste este cambio, ignora este correo.";
$headers = "From: no-reply@localhost\r\n";

if (mail($email, $subject, $message, $headers)) {
    echo "<script>alert('Se ha enviado un enlace a tu correo. Revisa la bandeja.'); window.location='index.php';</script>";
} else {
    // En entornos de desarrollo es útil mostrar el enlace
    echo "<p>No se pudo enviar correo. Usa este enlace para probar:</p>";
    echo "<p><a href='$reset_link'>$reset_link</a></p>";
    echo "<p><a href='index.php'>Volver</a></p>";
}

?>
