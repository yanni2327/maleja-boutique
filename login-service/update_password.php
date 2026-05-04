<?php
include('conexion.php');

// Habilitar reporte de errores para depuración temporal
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.php');
    exit;
}

$token = $conexion->real_escape_string($_POST['token']);
$password = $_POST['password'];
$password2 = $_POST['password2'];

if ($password !== $password2) {
    echo "<script>alert('Las contraseñas no coinciden'); window.history.back();</script>";
    exit;
}

// Buscar token válido
$stmt = $conexion->prepare("SELECT correo, expires_at FROM password_resets WHERE token = ? LIMIT 1");
$stmt->bind_param('s', $token);
$stmt->execute();
$res = $stmt->get_result();
if ($res->num_rows == 0) {
    echo "<script>alert('Token inválido o ya usado'); window.location='forgot.php';</script>";
    exit;
}
$row = $res->fetch_assoc();
if (strtotime($row['expires_at']) < time()) {
    // eliminar token expirado
    $del = $conexion->prepare("DELETE FROM password_resets WHERE token = ?");
    $del->bind_param('s', $token);
    $del->execute();
    $del->close();
    echo "<script>alert('El token ha expirado'); window.location='forgot.php';</script>";
    exit;
}
$correo = $row['correo'];
$stmt->close();

// Actualizar contraseña (manteniendo el mismo formato que usa la app: texto plano)
$newpass = $conexion->real_escape_string($password);
$upd = $conexion->prepare("UPDATE usuarios SET password = ? WHERE correo = ?");
$upd->bind_param('ss', $newpass, $correo);
if ($upd->execute()) {
    // eliminar token
    $del = $conexion->prepare("DELETE FROM password_resets WHERE token = ?");
    $del->bind_param('s', $token);
    $del->execute();
    $del->close();

    echo "<script>alert('Contraseña actualizada correctamente'); window.location='index.php';</script>";
} else {
    $updErr = $upd->error;
    echo "<p>Error al actualizar la contraseña: " . htmlspecialchars($updErr) . "</p>";
    echo "<p><a href='reset.php?token=" . urlencode($token) . "'>Volver al formulario</a></p>";
}

?>
