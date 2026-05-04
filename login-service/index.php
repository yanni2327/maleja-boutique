<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
</head>

<body>

    <div class="formulario">

        <!-- LOGIN -->
        <section id="login-panel" class="form-panel">
            <h1>Inicio de sesión</h1>
            <form action="login.php" method="POST">
                <div class="username">
                    <input type="text" name="usuario" required>
                    <label>Usuario</label>
                    <span></span>
                </div>

                <div class="username">
                    <input type="password" name="password" required>
                    <label>Contraseña</label>
                    <span></span>
                </div>

                <div class="forgot">
                    <a href="forgot.php">¿Olvidaste tu contraseña?</a>
                </div>

                <input type="submit" value="Ingresar">

                <div class="registarse">
                    Quiero hacer el <a href="#" id="show-register">registro</a>
                </div>
            </form>
        </section>

        <!-- REGISTRO -->
        <section id="register-panel" class="form-panel hidden">
            <h1>Regístrate</h1>
            <form action="register.php" method="POST">
                <div class="username">
                    <input type="text" name="nombre" required>
                    <label>Nombre completo</label>
                    <span></span>
                </div>

                <div class="username">
                    <input type="email" name="correo" required>
                    <label>Correo electrónico</label>
                    <span></span>
                </div>

                <div class="username">
                    <input type="text" name="usuario" required>
                    <label>Usuario</label>
                    <span></span>
                </div>

                <div class="username">
                    <input type="password" name="password" required>
                    <label>Contraseña</label>
                    <span></span>
                </div>

                <input type="submit" value="Registrarse">

                <div class="registarse">
                    ¿Ya tienes cuenta? <a href="#" id="show-login">Iniciar sesión</a>
                </div>
            </form>
        </section>

    </div>

    <script>
        const showRegister = document.getElementById('show-register');
        const showLogin = document.getElementById('show-login');
        const loginPanel = document.getElementById('login-panel');
        const registerPanel = document.getElementById('register-panel');

        showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            loginPanel.classList.add('hidden');
            registerPanel.classList.remove('hidden');
        });

        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            registerPanel.classList.add('hidden');
            loginPanel.classList.remove('hidden');
        });
    </script>

</body>

</html>