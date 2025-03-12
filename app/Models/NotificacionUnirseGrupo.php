<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotificacionUnirseGrupo extends Model
{
    use HasFactory;

    protected $table = 'notificaciones_unirse_grupo';

    protected $fillable = [
        'id_usuario_solicitante',
        'id_usuario_creador_grupo',
        'id_grupo',
        'estatus',
    ];

    /**
     * Relación con el usuario solicitante.
     */
    public function usuarioSolicitante()
    {
        return $this->belongsTo(User::class, 'id_usuario_solicitante');
    }

    /**
     * Relación con el usuario creador del grupo.
     */
    public function usuarioCreadorGrupo()
    {
        return $this->belongsTo(User::class, 'id_usuario_creador_grupo');
    }

    /**
     * Relación con el grupo.
     */
    public function grupo()
    {
        return $this->belongsTo(GrupoColaborador::class, 'id_grupo');
    }
}
