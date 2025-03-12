<?php

namespace App\Http\Controllers;

use Dompdf\Dompdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\RecursoEducativo;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use App\Models\GrupoUsuario; // Para obtener los grupos del usuario
use App\Models\GrupoColaborador; // Si se necesita el grupo completo
use Illuminate\Support\Facades\Auth;
use PhpOffice\PhpPresentation\IOFactory;
use App\Models\User;
use App\Models\CalificacionRecurso;

class RecursosEducativosController extends Controller
{
    public function index()
    {
        $userId = auth()->id(); // Obtener el ID del usuario autenticado

        $userdata=User::where('id',$userId)->get();
        $typeuser= $userdata->pluck('user_type');
        // Obtener los grupos a los que pertenece el usuario
        $grupos = GrupoUsuario::where('usuario_id', $userId)->get();
        $nombreGrupos = GrupoColaborador::whereIn('id', $grupos->pluck('grupo_id'))
            ->get(['id', 'nombre']);

        if ($typeuser->contains('admin')) {
            // Obtener todos los recursos educativos con la relación del usuario
            $recursos = RecursoEducativo::with('user:id,nombre')->get();
            return Inertia::render('RecursosEducativos', [
                'recursos' => $recursos,
                'grupos' => $nombreGrupos,
            ]);
        }
        else{
            // Obtener los recursos educativos del usuario autenticado
            $recursos = RecursoEducativo::with('user:id,nombre')->where('user_id', $userId)->get();
            return Inertia::render('Profesor/MisRecursos', [
                'recursos' => $recursos,
                'grupos' => $nombreGrupos,
            ]);
        }


    }

    public function store(Request $request)
    {
        // Validación de los datos enviados desde el formulario
        $userId = auth()->id();

        $validatedData = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'tipo' => 'required|string|in:PDF,DOCX,PPTX,Enlace Web',
            'archivo' => $request->tipo === 'Enlace Web' ? 'nullable|file' : 'required|file|mimes:pdf,docx,pptx|max:10240', // Máx 10MB
            'url' => $request->tipo === 'Enlace Web' ? 'required|url' : 'nullable|url',
            'grupo_id' => 'required|exists:grupos_colaboradores,id',
        ]);

        // Guardar el archivo en 'public/recursos' y obtener la ruta
        $archivoPath = null;
        if ($request->hasFile('archivo')) {
            $archivoPath = $request->file('archivo')->store('recursos', 'public');
        }

        // Si el archivo es PPTX, convertirlo a PDF
        if ($validatedData['tipo'] === 'PPTX' && $archivoPath) {
            $archivoPath = $this->convertPptxToPdf($archivoPath);
        }

        // Crear el recurso en la base de datos
        $recurso = RecursoEducativo::create([
            'titulo' => $validatedData['titulo'],
            'descripcion' => $validatedData['descripcion'],
            'tipo' => $validatedData['tipo'],
            'archivo_path' => $archivoPath, // Guardamos la ruta del archivo
            'url' => isset($validatedData['url']) ? $validatedData['url'] : null, // Verificamos si la clave 'url' existe
            'grupo_colaborador_id' => $validatedData['grupo_id'],
            'user_id' => $userId,
        ]);

        return redirect()->route('recursos.index')->with('message', 'Recurso educativo creado exitosamente.');
    }

// Función para convertir PPTX a PDF

    /**
     * @throws \Exception
     */
    private function convertPptxToPdf($archivoPath)
    {
        // Ruta completa del archivo PPTX
        $pptxPath = storage_path('app/public/' . $archivoPath);

        // Cargar el archivo PPTX
        $phpPresentation = IOFactory::load($pptxPath);

        // Crear un nuevo PDF
        $dompdf = new Dompdf();

        // Generar el contenido HTML del PPTX
        $html = '<h1>' . $phpPresentation->getProperties()->getTitle() . '</h1>';
        foreach ($phpPresentation->getAllSlides() as $slide) {
            foreach ($slide->getShapeCollection() as $shape) {
                if ($shape instanceof \PhpOffice\PhpPresentation\Shape\RichText) {
                    $html .= '<p>' . $shape->getPlainText() . '</p>';
                }
            }
        }

        // Cargar el HTML en Dompdf
        $dompdf->loadHtml($html);

        // Renderizar el PDF
        $dompdf->render();

        // Guardar el PDF en el almacenamiento
        $pdfPath = str_replace('.pptx', '.pdf', $archivoPath);
        Storage::disk('public')->put($pdfPath, $dompdf->output());

        // Eliminar el archivo PPTX original
        Storage::disk('public')->delete($archivoPath);

        return $pdfPath;
    }

    public function edit($id)
    {
        $recurso = RecursoEducativo::findOrFail($id);
        return Inertia::render('EditarRecursoEducativo', [
            'recurso' => $recurso,
        ]);
    }

    public function update(Request $request, $id)
    {
        $recurso = RecursoEducativo::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'titulo' => 'required|max:255',
            'descripcion' => 'required|max:1000',
            'tipo' => 'required|in:PDF,DOCX,PPTX,Enlace Web',  // Validación correcta
            'url' => $request->tipo === 'Enlace Web' ? 'required|url' : 'nullable|url',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Verificar si se proporcionó un nuevo archivo y manejar la actualización
        $archivoPath = $recurso->archivo_path;  // Asignar la URL actual por defecto
        if ($request->hasFile('archivo')) {
            // Eliminar el archivo anterior si existe
            $this->deleteFile($recurso->archivo_path);
            // Almacenar el nuevo archivo y obtener su ruta
            $archivoPath = $request->file('archivo')->store('recursos', 'public');
        }
        $recurso->archivo_path = null;

        $validatedData = $validator->validated(); // Obtiene los datos validados
        if ($validatedData['tipo'] === 'PPTX' && isset($validatedData['archivo'])) {
            $archivoPath = $this->convertPptxToPdf($archivoPath);
        }

        // Actualizar el recurso con los nuevos datos
        $recurso->update([
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion,
            'tipo' => $request->tipo,
            'archivo_path' => $archivoPath,  // Se usa la nueva URL del archivo si fue cargado
            'url' => $request->url,
        ]);

        return redirect()->route('recursos.index')->with('message', 'Recurso educativo actualizado exitosamente.');
    }

    public function destroy($id)
    {
        $recurso = RecursoEducativo::findOrFail($id);

        // Eliminar el archivo asociado al recurso
        $this->deleteFile($recurso->url);

        $recurso->delete();

        return redirect()->route('recursos.index')->with('message', 'Recurso educativo eliminado exitosamente.');
    }

    private function deleteFile($filePath)
    {
        if ($filePath && Storage::disk('public')->exists($filePath)) {
            Storage::disk('public')->delete($filePath);
        }
    }

    public function recursosProfesor()
    {
        $userId = Auth::id();

        // Obtener los grupos en los que el profesor está inscrito con sus recursos
        $grupos = GrupoColaborador::whereHas('usuarios', function ($query) use ($userId) {
            $query->where('usuario_id', $userId);
        })->with('recursos')->get();

        return Inertia::render('Profesor/ListaRecursos', [
            'grupos' => $grupos
        ]);
    }

    // Método para calificar un recurso
    public function calificar(Request $request, $recursoId)
{
    $request->validate([
        'calificacion' => 'required|integer|min:1|max:5',
    ]);

    $user = Auth::user();

    // Buscar o crear la calificación del usuario para el recurso
    $calificacion = CalificacionRecurso::updateOrCreate(
        [
            'recurso_id' => $recursoId,
            'user_id' => $user->id,
        ],
        [
            'calificacion' => $request->calificacion,
        ]
    );

    // Calcular el promedio de calificaciones para el recurso
    $promedio = CalificacionRecurso::where('recurso_id', $recursoId)->avg('calificacion');

    // Actualizar el campo "calificacion" en la tabla "recursos_educativos"
    RecursoEducativo::where('id', $recursoId)->update(['calificacion' => $promedio]);

    // Devolver la calificación promedio actualizada
    return response()->json([
        'success' => true,
        'calificacion_promedio' => $promedio,
    ]);
}

    // Método para obtener las calificaciones del usuario
    public function calificacionesUsuario()
{
    $user = Auth::user();

    // Obtener las calificaciones del usuario
    $calificaciones = CalificacionRecurso::where('user_id', $user->id)
        ->pluck('calificacion', 'recurso_id');

    return response()->json($calificaciones);
}

public function misCalificados()
{
    // Obtener el ID del usuario autenticado
    $userId = Auth::id();

    // Obtener los recursos que el usuario ha calificado
    $recursosCalificados = RecursoEducativo::whereHas('calificaciones', function ($query) use ($userId) {
        $query->where('user_id', $userId);
    })
    ->with(['calificaciones' => function ($query) use ($userId) {
        $query->where('user_id', $userId);
    }])
    ->get();

    // Formatear los datos para la vista
    $recursosFormateados = $recursosCalificados->map(function ($recurso) {
        return [
            'id' => $recurso->id,
            'titulo' => $recurso->titulo,
            'descripcion' => $recurso->descripcion,
            'calificaciones' => $recurso->calificaciones->map(function ($calificacion) {
                return [
                    'calificacion' => $calificacion->calificacion,
                ];
            }),
            'calificacion' => $recurso->calificacion, // Calificación promedio
        ];
    });

    // Renderizar la vista de Inertia
    return Inertia::render('Profesor/MisCalificados', [
        'recursosCalificados' => $recursosFormateados,
    ]);
}


}
