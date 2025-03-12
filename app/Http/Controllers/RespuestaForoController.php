<?php

namespace App\Http\Controllers;

use App\Models\RespuestaForo;
use App\Models\PreguntaForo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RespuestaForoController extends Controller
{
    public function store(Request $request)
{
    $request->validate([
        'pregunta_id' => 'required|exists:preguntas_foro,id',
        'respuesta' => 'required|string',
    ]);

    // Incrementar el contador de respuestas
    $pregunta = PreguntaForo::findOrFail($request->pregunta_id);

    if ($pregunta->numero_respuestas >= 5) {
        return (response()->json([
            'message' => 'No puedes responder a esta pregunta porque ya tiene 5 respuestas.'
        ], 403));
    }

    $pregunta->increment('numero_respuestas');

    // Crear la respuesta
    $respuesta = RespuestaForo::create([
        'pregunta_id' => $request->pregunta_id,
        'usuario_id' => auth()->id(),
        'respuesta' => $request->respuesta,
    ]);

    // Cargar las relaciones necesarias
    $respuesta->load('usuario');

    // Retornar una respuesta JSON en lugar de redireccionar
    return response()->json([
        'message' => 'Respuesta enviada exitosamente',
        'respuesta' => $respuesta
    ]);
}

// Eliminar una respuesta
public function destroy($id)
{
    $respuesta = RespuestaForo::findOrFail($id);

    // Verificar si el usuario es el creador de la respuesta
    if ($respuesta->usuario_id !== Auth::id()) {
        return redirect()->back()->with('error', 'No tienes permiso para eliminar esta respuesta.');
    }

    $pregunta = $respuesta->preguntaForo;

    $respuesta->delete();

    // Disminuir el contador de respuestas en la pregunta
    $pregunta->decrement('numero_respuestas');

    return redirect()->route('preguntas.show', $pregunta->id)->with('success', 'Respuesta eliminada.');
}

}
