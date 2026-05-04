<?php
include('conexion.php');

$token = isset($_GET['token']) ? $conexion->real_escape_string($_GET['token']) : '';
if (empty($token)) {
    echo "<script>alert('Token inválido'); window.location='index.php';</script>";
    exit;
}

$stmt = $conexion->prepare("SELECT correo, expires_at FROM password_resets WHERE token = ? LIMIT 1");
$stmt->bind_param('s', $token);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows == 0) {
    echo "<script>alert('Token no válido o expirado'); window.location='index.php';</script>";
    exit;
}
$row = $result->fetch_assoc();
if (strtotime($row['expires_at']) < time()) {
    echo "<script>alert('El token ha expirado'); window.location='forgot.php';</script>";
    exit;
}
$correo = $row['correo'];
$stmt->close();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Nueva contraseña</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <div class="formulario">
        <section id="reset-panel" class="form-panel">
            <h1>Establecer nueva contraseña</h1>
            <form action="update_password.php" method="post">
                <input type="hidden" name="token" value="<?php echo htmlspecialchars($token); ?>">

                <div class="username">
                    <input type="password" name="password" id="password" required>
                    <label>Nueva contraseña</label>
                    <span></span>
                </div>

                <div class="username">
                    <input type="password" name="password2" id="password2" required>
                    <label>Confirmar contraseña</label>
                    <span></span>
                </div>

                <input type="submit" value="Actualizar contraseña">

                <div class="registarse">
                    <a href="index.php">Volver al inicio</a>
                </div>
            </form>
        </section>
    </div>

</body>
</html>
