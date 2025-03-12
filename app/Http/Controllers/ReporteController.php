<?php

namespace App\Http\Controllers;

use App\Models\NotificacionUnirseGrupo;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\RecursoEducativo;
use App\Models\RespuestasEncuesta;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\DB;


class ReporteController extends Controller
{
    public function index()
    {
        return Inertia::render('Reportes');
    }

    // Validar que la fecha de inicio sea menor que la fecha de fin
    private function validarFechas($fechaInicio, $fechaFin)
    {
        if ($fechaInicio > $fechaFin) {

        }
        return null;
    }

    // Generar reporte de los Top 5 mejor calificados
    public function topRecursos(Request $request)
    {
        $fechaInicio = $request->input('fecha_inicio');
        $fechaFin = $request->input('fecha_fin');

        // Validar fechas
        $validacion = $this->validarFechas($fechaInicio, $fechaFin);
        if ($validacion) {
            return $validacion;
        }

        $recursos = RecursoEducativo::whereBetween('created_at', [$fechaInicio, $fechaFin])
            ->orderByDesc('calificacion')
            ->limit(5)
            ->get();

        $pdf = Pdf::loadView('pdf.reporte_top_recursos', compact('recursos', 'fechaInicio', 'fechaFin'));

        return response()->streamDownload(function () use ($pdf) {
            echo $pdf->output();
        }, 'Top_5_Mejor_Calificados.pdf');
    }

    // Generar reporte de recursos por categorías (grupos)
    public function recursosPorCategoria(Request $request)
    {
        $fechaInicio = $request->input('fecha_inicio');
        $fechaFin = $request->input('fecha_fin');

        // Validar fechas
        $validacion = $this->validarFechas($fechaInicio, $fechaFin);
        if ($validacion) {
            return $validacion;
        }

        // Obtener los recursos
        $recursos = RecursoEducativo::whereBetween('created_at', [$fechaInicio, $fechaFin])
            ->selectRaw('tipo, COUNT(*) as total')
            ->groupBy('tipo')
            ->get();

        // Preparar datos para la gráfica
        $categorias = $recursos->pluck('tipo')->toArray();
        $totales = $recursos->pluck('total')->toArray();

        // Construir la URL de la gráfica usando image-charts
        $chartUrl = $this->generarGrafica($categorias, $totales);

        // Descargar la imagen y guardarla temporalmente
        $imageContent = file_get_contents($chartUrl);
        $imageName = 'grafica_' . time() . '.png'; // Nombre único para la imagen
        Storage::disk('public')->put($imageName, $imageContent);

        // Ruta de la imagen guardada
        $imagePath = storage_path('app/public/' . $imageName);

        // Pasar la ruta de la imagen a la vista
        $pdf = Pdf::loadView('pdf.reporte_recursos_categoria', compact('recursos', 'fechaInicio', 'fechaFin', 'imagePath'));

        return $pdf->download('Recursos_Por_Categoria.pdf');
    }

    private function generarGrafica($categorias, $totales)
    {
        // Convertir arrays a cadenas para la URL
        $labels = implode('|', $categorias);
        $data = implode(',', $totales);

        // Construir la URL de la gráfica
       // Construir la URL de la gráfica con un diseño mejorado
       $chartUrl = "https://image-charts.com/chart?" .
       "cht=bvs&" . // Tipo de gráfica: barras verticales
       "chd=t:$data&" . // Datos de la gráfica
       "chl=$labels&" . // Etiquetas de las barras
       "chs=600x400&" . // Tamaño de la gráfica
       "chco=4F81BD|8A2BE2|FF6347|32CD32|FFD700&" . // Colores de las barras
       "chxt=x,y&" . // Mostrar ejes X e Y
       "chxl=0:|$labels&" . // Etiquetas del eje X
       "chxr=1,0," . max($totales) . "&" . // Rango del eje Y
       "chf=b0,lg,90,3498db,0,ffffff,1&" . // Fondo degradado
       "chds=0," . max($totales) . "&" . // Escala de los datos
       "chtt=Recursos+por+Categoría&" . // Título de la gráfica
       "chts=000000,16&" . // Color y tamaño del título
       "chma=30,30,30,30&" . // Márgenes
       "chg=20,20"; // Líneas de la cuadrícula

        return $chartUrl;
    }

    public function recursosPorSolicitudes(Request $request)
    {
        $fechaInicio = $request->input('fecha_inicio');
        $fechaFin = $request->input('fecha_fin');

        // Validar fechas
        $validacion = $this->validarFechas($fechaInicio, $fechaFin);
        if ($validacion) {
            return $validacion;
        }

        // Obtener las solicitudes con nombres de usuarios y grupos
        $solicitudes = NotificacionUnirseGrupo::whereBetween('notificaciones_unirse_grupo.created_at', [$fechaInicio, $fechaFin])
        ->join('users as solicitante', 'notificaciones_unirse_grupo.id_usuario_solicitante', '=', 'solicitante.id')
        ->join('users as creador', 'notificaciones_unirse_grupo.id_usuario_creador_grupo', '=', 'creador.id')
        ->join('grupos_colaboradores', 'notificaciones_unirse_grupo.id_grupo', '=', 'grupos_colaboradores.id')
        ->select(
            'notificaciones_unirse_grupo.*',
            'solicitante.nombre as nombre_solicitante', // Nombre del usuario solicitante
            'creador.nombre as nombre_creador', // Nombre del usuario creador del grupo
            'grupos_colaboradores.nombre as nombre_grupo', // Nombre del grupo
            'notificaciones_unirse_grupo.estatus' // Campo estatus
        )
        ->get();

            // Generar el PDF
            $pdf = Pdf::loadView('pdf.reporte_recursos_solicitudes', compact('solicitudes', 'fechaInicio', 'fechaFin'));

        return $pdf->download('Recursos_Por_Solicitudes.pdf');
    }

    // Agrega esta función a tu controlador ReporteController
    public function indicadoresEncuesta(Request $request)
{
    $fechaInicio = $request->input('fecha_inicio');
    $fechaFin = $request->input('fecha_fin');

    // Validar fechas
    $validacion = $this->validarFechas($fechaInicio, $fechaFin);
    if ($validacion) {
        return $validacion;
    }

    // Consulta para contar las respuestas por encuesta y tipo de respuesta
    $respuestas = RespuestasEncuesta::whereBetween('respuestas_encuesta.created_at', [$fechaInicio, $fechaFin])
        ->join('preguntas_encuesta', 'respuestas_encuesta.pregunta_id', '=', 'preguntas_encuesta.id')
        ->join('encuestas', 'preguntas_encuesta.encuesta_id', '=', 'encuestas.id') // Unir con la tabla encuestas
        ->select(
            'encuestas.titulo', // Seleccionar el título de la encuesta
            'respuestas_encuesta.respuesta',
            DB::raw('count(*) as total')
        )
        ->groupBy('encuestas.titulo', 'respuestas_encuesta.respuesta') // Agrupar por título de la encuesta
        ->get();

    // Organizar los datos por encuesta
    $encuestas = [];
    foreach ($respuestas as $respuesta) {
        $tituloEncuesta = $respuesta->titulo; // Usar el título de la encuesta como clave
        if (!isset($encuestas[$tituloEncuesta])) {
            $encuestas[$tituloEncuesta] = [
                'Totalmente de acuerdo' => 0,
                'De acuerdo' => 0,
                'Neutral' => 0,
                'En desacuerdo' => 0,
                'Totalmente en desacuerdo' => 0,
            ];
        }
        $encuestas[$tituloEncuesta][$respuesta->respuesta] = $respuesta->total;
    }

    // Generar el PDF
    $pdf = Pdf::loadView('pdf.reporte_indicadores_encuesta', compact('encuestas', 'fechaInicio', 'fechaFin'));

    return $pdf->download('Indicadores_Encuesta_Aplicada.pdf');
}


}
