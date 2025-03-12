<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\RecursoEducativo;
use App\Models\GrupoColaborador;
use App\Models\GrupoUsuario;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // Obtener los 5 recursos más nuevos
        $recursosNuevos = RecursoEducativo::orderBy('created_at', 'desc')->take(5)->get();

        // Obtener los 5 recursos mejor calificados
        $recursosMejorCalificados = RecursoEducativo::orderByDesc('calificacion')->take(5)->get();

        // Obtener los 5 grupos con más miembros
        $gruposMasGrandes = GrupoColaborador::withCount('usuarios')
            ->orderByDesc('usuarios_count')
            ->take(5)
            ->get();

        // Obtener los 5 grupos con más recursos
        $gruposMasRecursos = GrupoColaborador::withCount('recursos') // Cuenta los recursos en cada grupo
        ->orderByDesc('recursos_count') // Ordena por cantidad de recursos
        ->take(5) // Obtiene solo los 5 primeros
        ->get();

        // Obtener la distribución de usuarios por grado académico
        $usuariosPorGradoAcademico = User::select('gradoAcademico', DB::raw('COUNT(*) as total'))
            ->groupBy('gradoAcademico')
            ->get();

        return Inertia::render('Dashboard', [
            'recursosNuevos' => $recursosNuevos,
            'recursosMejorCalificados' => $recursosMejorCalificados,
            'gruposMasGrandes' => $gruposMasGrandes,
            'gruposMasRecursos' => $gruposMasRecursos, // Nuevo dato
            'usuariosPorGradoAcademico' => $usuariosPorGradoAcademico, // Enviar la distribución de usuarios
        ]);

        
        
    }
}
