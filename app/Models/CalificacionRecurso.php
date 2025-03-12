<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CalificacionRecurso extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'calificaciones_recursos';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'recurso_id',
        'user_id',
        'calificacion',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'calificacion' => 'decimal:2',
    ];

    /**
     * Obtener el recurso educativo asociado a la calificación.
     */
    public function recurso()
    {
        return $this->belongsTo(RecursoEducativo::class, 'recurso_id');
    }

    /**
     * Obtener el usuario que realizó la calificación.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}