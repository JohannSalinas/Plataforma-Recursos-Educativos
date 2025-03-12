<?php

namespace App\Http\Controllers;

use App\Mail\NotificacionEstatusMail;
use App\Models\NotificacionUnirseGrupo;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\GrupoColaborador;
use App\Models\GrupoUsuario;
use Illuminate\Support\Facades\Mail;

class NotificationsController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'grupo_id' => 'required|exists:grupos_colaboradores,id',
            'creador_id' => 'required|exists:users,id',
            'usuario_id' => 'required|exists:users,id',
        ]);

        // Crear la notificación o procesar lo que necesites
        NotificacionUnirseGrupo::create([
            'id_usuario_solicitante' => $validated['usuario_id'],
            'id_usuario_creador_grupo' => $validated['creador_id'],
            'id_grupo' => $validated['grupo_id'],
            'estatus' => 'pendiente', // Inicialmente pendiente
        ]);

        return redirect()->back()->with('success', 'Notificación enviada correctamente.');
    }

    public function show()
    {
        $userId = auth()->id();

        $notificaciones = NotificacionUnirseGrupo::with(['grupo', 'usuarioSolicitante'])
            ->where('id_usuario_solicitante', $userId) // Notificaciones del solicitante
            ->orWhere('id_usuario_creador_grupo', $userId)
            ->orderby('updated_at','desc') // Notificaciones del creador
            ->get();

        return inertia('Notificaciones', [
            'notificaciones' => $notificaciones,
        ]);
    }

    public function update($id, Request $request)
    {
        // Validación del estatus
        $request->validate([
            'estatus' => 'required|in:aceptado,rechazado',
            'visible' => 'required|boolean', // Aseguramos que sea un valor booleano
        ]);

        // Buscar la notificación por ID
        $notificacion = NotificacionUnirseGrupo::findOrFail($id);

        // Si el estatus es "aceptado", incrementamos el número de inscritos
        if ($request->estatus === 'aceptado') {
            $grupo = GrupoColaborador::findOrFail($notificacion->id_grupo);
            $grupo->increment('numero_inscritos');

            $nuevoRequest = new Request([
                'usuario_id' => $notificacion->id_usuario_solicitante, // O el dato correcto
            ]);

            $grupoUsuarioController = new GrupoUsuarioController();
            $grupoUsuarioController->store($nuevoRequest, $notificacion->id_grupo);
        }

        // Actualizamos el estatus de la notificación si es aceptado o rechazado
        $notificacion->estatus = $request->estatus;

        // Solo actualizamos la visibilidad cuando es "deshabilitado"
        if ($request->estatus === 'rechazado' || $request->estatus === 'aceptado') {
            $notificacion->visible = $request->visible;  // Actualizamos la visibilidad
        }

        $notificacion->save();

        // Obtener el usuario solicitante y el nombre del grupo
        $usuarioSolicitante = User::findOrFail($notificacion->id_usuario_solicitante);
        $grupo = GrupoColaborador::findOrFail($notificacion->id_grupo);

        // Enviar el correo al usuario solicitante
        Mail::to($usuarioSolicitante->email)->send(new NotificacionEstatusMail($request->estatus, $grupo->nombre, $usuarioSolicitante->nombre));
    }
}
