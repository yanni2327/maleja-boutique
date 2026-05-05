<?php
include("conexion.php");

$usuario  = $_POST['usuario'];
$password = $_POST['password'];

$sql       = "SELECT * FROM usuarios WHERE usuario='$usuario' AND password='$password'";
$resultado = $conexion->query($sql);

if ($resultado->num_rows > 0) {
    $user     = $resultado->fetch_assoc();
    $token    = 'php-session-' . $user['id'] . '-' . time();
    $role     = isset($user['role']) ? $user['role'] : 'customer';
    $userData = urlencode(json_encode([
        'id'      => $user['id'],
        'nombre'  => $user['nombre'],
        'correo'  => $user['correo'],
        'usuario' => $user['usuario'],
        'role'    => $role
    ]));
    header("Location: https://humorous-acceptance-production.up.railway.app/auth-callback?token=" . $token . "&user=" . $userData);
    exit();
} else {
    echo "<script>
        alert('Usuario o contraseña incorrectos');
        window.location='index.php';
    </script>";
}
?>
