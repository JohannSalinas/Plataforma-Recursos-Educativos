<?php

namespace App\Http\Controllers;

use App\Models\GrupoUsuario;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GrupoUsuarioController extends Controller
{
    // Mostrar todos los usuarios en un grupo específico
    public function index()
    {
        try {
            $gruposUsuarios = GrupoUsuario::with(['grupoColaborador', 'usuario'])
                ->get()
                ->map(function ($grupoUsuario) {
                    return [
                        'id' => $grupoUsuario->grupoColaborador->id,
                        'nombre' => $grupoUsuario->grupoColaborador->nombre,
                        'usuarios' => [
                            [
                                'id' => $grupoUsuario->usuario->id,
                                'nombre' => $grupoUsuario->usuario->nombre,
                                'email' => $grupoUsuario->usuario->email,
                            ]
                        ]
                    ];
                })
                ->groupBy('id')
                ->map(function ($grupo) {
                    return [
                        'id' => $grupo[0]['id'],
                        'nombre' => $grupo[0]['nombre'],
                        'usuarios' => collect($grupo)->pluck('usuarios')->flatten(1)->values()
                    ];
                })
                ->values();

            return Inertia::render('GrupoUsuario', [
                'gruposColaboradores' => $gruposUsuarios
            ]);
        } catch (\Exception $e) {
            return Inertia::render('GrupoUsuario', [
                'gruposColaboradores' => []
            ]);
        }
    }

    // Vincular un usuario a un grupo
    public function store(Request $request, $grupo_id)
    {
        $validated = $request->validate([
            'usuario_id' => 'required|exists:users,id',
        ]);

        $grupoUsuario = GrupoUsuario::create([
            'grupo_id' => $grupo_id,
            'usuario_id' => $validated['usuario_id'],
        ]);

        return response()->json($grupoUsuario, 201);
    }

    // Desvincular un usuario de un grupo
    public function destroy($grupo_id, $usuario_id)
    {
        $grupoUsuario = GrupoUsuario::where('grupo_id', $grupo_id)
                                     ->where('usuario_id', $usuario_id)
                                     ->first();

        if ($grupoUsuario) {
            $grupoUsuario->delete();
            return response()->json(['message' => 'Usuario desvinculado del grupo']);
        }

        return response()->json(['message' => 'No se encontró la relación'], 404);
    }

    public function show($id)
{
    $grupoColaborador = GrupoColaborador::with('usuarios')->findOrFail($id);

    return Inertia::render('GruposUsuario', [
        'grupoColaborador' => $grupoColaborador,
        'grupoId' => $id, // Pasar el ID del grupo para que esté disponible en el frontend
    ]);
}


}
