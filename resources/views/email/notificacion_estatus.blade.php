<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Actualización de estatus de solicitud</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .email-header {
            background-color: #007BFF;
            color: #ffffff;
            padding: 20px;
            text-align: center;
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
            line-height: 1.6;
        }
        .email-footer {
            background-color: #f4f4f4;
            padding: 15px;
            text-align: center;
            font-size: 14px;
            color: #666666;
        }
        .status-message {
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
        }
        .status-message.accepted {
            background-color: #e8f5e9;
            color: #2e7d32;
        }
        .status-message.rejected {
            background-color: #ffebee;
            color: #c62828;
        }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            background-color: #007BFF;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
        }
    </style>
</head>
<body>
<div class="email-container">
    <!-- Encabezado -->
    <div class="email-header">
        <h1>Actualización de estatus de solicitud</h1>
    </div>

    <!-- Cuerpo del correo -->
    <div class="email-body">
        <p>Hola <strong>{{ $nombre }}</strong>,</p>
        <p>Tu solicitud para unirte al grupo <strong>{{ $grupoNombre }}</strong> ha sido <strong>{{ $estatus }}</strong>.</p>

        <!-- Mensaje adicional según el estatus -->
        <div class="status-message {{ $estatus === 'aceptado' ? 'accepted' : 'rejected' }}">
            @if ($estatus === 'aceptado')
                <p>¡Felicidades! Has sido aceptado en el grupo. Ahora puedes colaborar con otros miembros y acceder a los recursos del grupo.</p>
            @elseif ($estatus === 'rechazado')
                <p>Lamentamos informarte que tu solicitud ha sido rechazada. Si tienes alguna pregunta o necesitas más información, no dudes en contactar a soporte.</p>
            @endif
        </div>

        <p>Gracias por usar nuestra plataforma.</p>

        <!-- Botón de acción (opcional) -->
        <a href="{{ route('grupos-colaboradores.profesor') }}" class="btn">Ver grupos</a>
    </div>

    <!-- Pie de página -->
    <div class="email-footer">
        <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
        <p>&copy; {{ date('Y') }} Plataforma Educativa. Todos los derechos reservados.</p>
    </div>
</div>
</body>
</html>
