<?php
include("conexion.php");

$nombre   = $_POST['nombre'];
$correo   = $_POST['correo'];
$usuario  = $_POST['usuario'];
$password = $_POST['password'];

$sql = "INSERT INTO usuarios (nombre, correo, usuario, password, role)
        VALUES ('$nombre', '$correo', '$usuario', '$password', 'customer')";

if ($conexion->query($sql) === TRUE) {
    echo "<script>
        alert('Usuario registrado correctamente');
        window.location='index.php';
    </script>";
} else {
    echo "<script>
        alert('Error al registrar: usuario o correo ya existe');
        window.location='index.php';
    </script>";
}
?>
