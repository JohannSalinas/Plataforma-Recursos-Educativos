<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecer Contraseña</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            background-color: #4a90e2;
            color: #ffffff;
            text-align: center;
            padding: 20px;
        }
        .email-header h1 {
            margin: 0;
            font-size: 24px;
        }
        .email-body {
            padding: 20px;
            color: #333333;
        }
        .email-body p {
            font-size: 16px;
            line-height: 1.5;
        }
        .email-body a {
            display: inline-block;
            background-color: #4a90e2;
            color: #ffffff;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .email-footer {
            text-align: center;
            padding: 10px;
            background-color: #f4f4f4;
            color: #777777;
            font-size: 14px;
        }
    </style>
</head>
<body>
<div class="email-container">
    <!-- Encabezado del correo -->
    <div class="email-header">
        <h1>Restablecer Contraseña</h1>
    </div>

    <!-- Cuerpo del correo -->
    <div class="email-body">
        <p>Hola,</p>
        <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el siguiente botón para continuar:</p>
        <a href="{{ $resetUrl }}">Restablecer Contraseña</a>
        <p>Si no solicitaste este cambio, puedes ignorar este correo electrónico.</p>
        <p>Gracias,<br>El equipo de soporte</p>
    </div>

    <!-- Pie de página del correo -->
    <div class="email-footer">
        <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
    </div>
</div>
</body>
</html>
