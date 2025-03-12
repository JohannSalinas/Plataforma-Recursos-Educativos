<!DOCTYPE html>
<html>
<head>
    <title>Indicadores de la Encuesta Aplicada</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            font-size: 24px;
            color: #2c3e50;
            margin: 0;
        }
        .header h2 {
            font-size: 18px;
            color: #34495e;
            margin: 5px 0 0;
        }
        .header p {
            font-size: 14px;
            color: #7f8c8d;
            margin: 5px 0;
        }
        .encuesta {
            margin-bottom: 40px;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .encuesta h2 {
            font-size: 20px;
            color: #3498db;
            margin-bottom: 15px;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th, td {
            padding: 12px 15px;
            text-align: left;
        }
        th {
            background-color: #3498db;
            color: #ffffff;
            font-weight: bold;
            text-transform: uppercase;
        }
        td {
            border-bottom: 1px solid #dddddd;
        }
        tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        tr:hover {
            background-color: #f1f1f1;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #7f8c8d;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>PLATAFORMA PARA RECURSOS EDUCATIVOS ABIERTOS PARA DOCENTES</h1>
        <h2>Indicadores de la Encuesta Aplicada</h2>
        <p><strong>Fecha de inicio:</strong> {{ $fechaInicio }}</p>
        <p><strong>Fecha de fin:</strong> {{ $fechaFin }}</p>
    </div>

    @foreach ($encuestas as $tituloEncuesta => $respuestas)
        <div class="encuesta">
            <h2>Encuesta: {{ $tituloEncuesta }}</h2> <!-- Mostrar el título de la encuesta -->
            <table>
                <thead>
                    <tr>
                        <th>Respuesta</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($respuestas as $respuesta => $total)
                        <tr>
                            <td>{{ $respuesta }}</td>
                            <td>{{ $total }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @endforeach

    <div class="footer">
        <p>Generado el: {{ now()->format('d/m/Y H:i:s') }}</p>
    </div>
</body>
</html>