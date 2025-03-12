<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Constantes para los tipos de usuario.
     */
    public const TYPE_ADMIN = 'admin';
    public const TYPE_COORDINADOR = 'coordinador';
    public const TYPE_PROFESOR = 'profesor';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'nombre',
        'email',
        'password',
        'user_type', // Agregado para permitir asignación masiva
        'genero',
        'apellidos',
        'gradoAcademico',
        'fechaNacimiento',
        'foto',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Verifica si el usuario es administrador.
     *
     * @return bool
     */
    public function isAdmin(): bool
    {
        return $this->user_type === self::TYPE_ADMIN;
    }

    /**
     * Verifica si el usuario es coordinador.
     *
     * @return bool
     */
    public function isCoordinador(): bool
    {
        return $this->user_type === self::TYPE_COORDINADOR;
    }

    /**
     * Verifica si el usuario es profesor.
     *
     * @return bool
     */
    public function isProfesor(): bool
    {
        return $this->user_type === self::TYPE_PROFESOR;
    }

    public function grupoUsuarios()
    {
        return $this->hasMany(GrupoUsuario::class, 'usuario_id');
    }

    public function notificacionesPendientes()
    {
        // Notificaciones pendientes para el usuario creador del grupo
        return $this->hasMany(NotificacionUnirseGrupo::class, 'id_usuario_creador_grupo')
            ->where('estatus', 'pendiente');
    }

    public function notificacionesAceptadas()
    {
        // Notificaciones aceptadas para el usuario solicitante y visibles (visible = 1)
        return $this->hasMany(NotificacionUnirseGrupo::class, 'id_usuario_solicitante')
            ->where('estatus', 'aceptado')
            ->where('visible', 1);
    }

    public function notificacionesActivas()
    {
        // Combinar notificaciones pendientes y aceptadas
        return $this->notificacionesPendientes->merge($this->notificacionesAceptadas);
    }


}
