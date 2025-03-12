<?php

namespace App\Http\Controllers;

use App\Models\PreguntaForo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PreguntaForoController extends Controller
{
    // Mostrar todas las preguntas del foro
    public function index()
    {
        // Obtener las preguntas ordenadas por fecha de creación (más nuevas primero)
        $preguntas = PreguntaForo::with(['usuario', 'respuestas.usuario'])
            ->orderBy('created_at', 'desc') // Ordenar por fecha de creación en orden descendente
            ->get();

        return Inertia::render('ListaPreguntas', [
            'preguntas' => $preguntas
        ]);
    }

    // Mostrar una pregunta específica con sus respuestas
    public function show($id)
    {
        $pregunta = PreguntaForo::with('usuario', 'respuestas.usuario')->findOrFail($id);

        return Inertia::render('Foro/DetallePregunta', [
            'pregunta' => $pregunta
        ]);
    }

    // Guardar una nueva pregunta
    public function store(Request $request)
    {
    $request->validate([
        'pregunta' => 'required|string|max:1000',
    ]);

    PreguntaForo::create([
        'usuario_id' => Auth::id(),
        'pregunta' => $request->pregunta,
        'respuestas_maximas' => 5, // El máximo es siempre 5
        'numero_respuestas' => 0 // Inicia con 0 respuestas
    ]);

    return redirect()->route('preguntas.index')->with('success', 'Pregunta creada con éxito.');
    }

    // Eliminar una pregunta
    public function destroy($id)
    {
        $pregunta = PreguntaForo::findOrFail($id);

        // Verificar si el usuario es el creador de la pregunta
        if ($pregunta->usuario_id !== Auth::id()) {
            return redirect()->route('preguntas.index')->with('error', 'No tienes permiso para eliminar esta pregunta.');
        }

        $pregunta->delete();

        return redirect()->route('preguntas.index')->with('success', 'Pregunta eliminada.');
    }

   
}
