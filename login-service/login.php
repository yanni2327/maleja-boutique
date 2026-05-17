<?php
include("conexion.php");

$usuario  = $_POST['usuario'];
$password = $_POST['password'];

$sql       = "SELECT * FROM usuarios WHERE usuario='$usuario' AND password='$password'";
$resultado = $conexion->query($sql);

if ($resultado->num_rows > 0) {
    $user = $resultado->fetch_assoc();
    $role = isset($user['role']) ? $user['role'] : 'customer';

    // ── Generar JWT real compatible con el orders-service y payments-service ──
    $secret  = 'maleja_jwt_secret_2024_super_seguro';
    $header  = base64url_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload = base64url_encode(json_encode([
        'id'   => $user['id'],
        'role' => $role,
        'iat'  => time(),
        'exp'  => time() + 86400   // expira en 24 horas
    ]));
    $signature = base64url_encode(
        hash_hmac('sha256', "$header.$payload", $secret, true)
    );
    $token = "$header.$payload.$signature";

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

// Codificación Base64URL (sin +, /, ni = finales)
function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}
?>
