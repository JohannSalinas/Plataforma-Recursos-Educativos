<?php

namespace App\Http\Controllers;

use App\Models\Encuesta;
use App\Models\PreguntaEncuesta;
use App\Models\RespuestasEncuesta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;


class EncuestaController extends Controller
{
    /**
     * Lista todas las encuestas.
     */
    public function index()
{
    $encuestas = Encuesta::with('preguntas')->get();  // Cargar las preguntas asociadas a las encuestas
    return inertia('GestionEncuestas', ['encuestas' => $encuestas]);
}

    /**
     * Guarda una nueva encuesta.
     */
    public function store(Request $request)
{
    $request->validate([
        'titulo' => 'required|string|max:255',
        'descripcion' => 'required|string',
        'numPreguntas' => 'required|integer|min:1',
        'preguntas' => 'required|array', // Validamos que preguntas sea un array
        'preguntas.*' => 'required|string|max:255', // Validamos cada pregunta individualmente
    ]);

    // Guardar encuesta
    $encuesta = Encuesta::create([
        'titulo' => $request->titulo,
        'descripcion' => $request->descripcion,
        'preguntas' => $request->numPreguntas,
        'user_id' => Auth::id(),
    ]);

    // Guardar las preguntas asociadas a la encuesta
    foreach ($request->preguntas as $pregunta) {
        $encuesta->preguntas()->create([
            'pregunta' => $pregunta,
        ]);
    }

    return redirect()->route('encuestas.index')->with('success', 'Encuesta creada correctamente.');
}

    /**
     * Elimina una encuesta.
     */
    public function destroy($id)
    {
        $encuesta = Encuesta::findOrFail($id);
        $encuesta->delete();

        return redirect()->back()->with('success', 'Encuesta eliminada correctamente.');
    }

    /**
     * Muestra la vista para editar una encuesta.
     */
    public function edit($id)
    {
        // Recupera la encuesta junto con las preguntas relacionadas
        $encuesta = Encuesta::with('preguntas')->findOrFail($id);

        // Pasa la encuesta con las preguntas al frontend
        return inertia('EditarEncuesta', ['encuesta' => $encuesta]);
    }

    /**
     * Actualiza la encuesta.
     */
    public function update(Request $request, $id)
    {
        // Validación de los datos
        $request->validate([
            'titulo' => 'required|string|max:255', // Título obligatorio
            'descripcion' => 'required|string', // Descripción obligatoria
            'preguntas' => 'required|array|min:1', // Asegura que las preguntas sean un array y que haya al menos una
            'preguntas.*' => 'required|string|max:255', // Cada pregunta debe ser una cadena de texto no vacía
        ]);

        // Encontrar la encuesta
        $encuesta = Encuesta::findOrFail($id);

        // Actualizar la encuesta
        $encuesta->update([
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion,
        ]);

        // Eliminar las preguntas existentes
        PreguntaEncuesta::where('encuesta_id', $encuesta->id)->delete();

        // Guardar las nuevas preguntas
        foreach ($request->preguntas as $pregunta) {
            PreguntaEncuesta::create([
                'encuesta_id' => $encuesta->id,
                'pregunta' => $pregunta,
            ]);
        }

        return redirect()->route('encuestas.index')->with('success', 'Encuesta actualizada correctamente.');
    }

    public function obtenerEncuestas()
    {
        $usuarioId = Auth::id(); // Obtener el ID del usuario autenticado

        // Obtener las encuestas con sus preguntas y respuestas
        $encuestas = Encuesta::with(['preguntas_encuesta.respuestas' => function ($query) use ($usuarioId) {
            $query->where('user_id', $usuarioId); // Cargar solo las respuestas del usuario actual
        }])
            ->orderBy('fecha_creacion', 'desc') // Ordenar por fecha de creación (más nuevas primero)
            ->get()
            ->map(function ($encuesta) use ($usuarioId) {
                // Verificar si el usuario ya ha contestado esta encuesta
                $encuesta->ya_contestada = $encuesta->preguntas_encuesta
                    ->flatMap(function ($pregunta) {
                        return $pregunta->respuestas; // Obtener todas las respuestas de las preguntas
                    })
                    ->contains('user_id', $usuarioId); // Verificar si alguna respuesta pertenece al usuario
    
                // Agregar las respuestas del usuario a cada pregunta
                $encuesta->preguntas_encuesta->each(function ($pregunta) use ($usuarioId) {
                    $pregunta->respuesta_usuario = $pregunta->respuestas
                        ->firstWhere('user_id', $usuarioId); // Obtener la respuesta del usuario
                });
    
                return $encuesta;
            });
    
        return inertia('Profesor/ListaEncuesta', [
            'encuestas' => $encuestas,
        ]);
    }

    public function responder(Request $request, $id)
    {
        $user_id = Auth::id(); // No es necesario convertirlo a string

        // Verificar si el usuario ya ha respondido la encuesta
        $validateReadyResponse = RespuestasEncuesta::where('user_id', $user_id)
            ->where('pregunta_id', $id)
            ->exists(); // Ejecutar la consulta con exists()

        Log::info('Usuario ya respondió la encuesta: ' . ($validateReadyResponse ? 'Sí' : 'No')); // Registrar el resultado

        if (!$validateReadyResponse) {
            // Validar las respuestas y el user_id
            $validated = $request->validate([
                'respuestas' => 'required|array',
                'respuestas.*' => 'in:Totalmente de acuerdo,De acuerdo,Neutral,En desacuerdo,Totalmente en desacuerdo',
                'user_id' => 'required|exists:users,id', // Asegúrate de que el user_id exista en la tabla users
            ]);

            // Guardar las respuestas junto con el user_id
            foreach ($validated['respuestas'] as $preguntaId => $respuesta) {
                RespuestasEncuesta::create([
                    'pregunta_id' => $preguntaId,
                    'respuesta' => $respuesta,
                    'user_id' => $validated['user_id'], // Agregar el user_id
                    'encuesta_id' => $id, // Asegúrate de guardar el ID de la encuesta
                ]);
            }

            
        } else {
            
        }
    }
}
