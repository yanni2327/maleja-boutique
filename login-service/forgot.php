<?php
// Formulario para solicitar restablecimiento de contraseña
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Restablecer contraseña</title>
    <link rel="stylesheet" href="css/style.css">
</head>

<body>

    <div class="formulario">
        <section id="forgot-panel" class="form-panel">
            <h1>Restablecer contraseña</h1>
            <form action="send_reset.php" method="post">
                <div class="username">
                    <input type="email" name="email" id="email" required>
                    <label>Correo electrónico</label>
                    <span></span>
                </div>

                <input type="submit" value="Enviar enlace">

                <div class="registarse">
                    <a href="index.php">Volver al inicio</a>
                </div>
            </form>
        </section>
    </div>

</body>

</html>
