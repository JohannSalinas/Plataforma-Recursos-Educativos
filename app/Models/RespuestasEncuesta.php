<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RespuestasEncuesta extends Model
{
    use HasFactory;

    protected $table = 'respuestas_encuesta';  // Define la tabla manualmente si no se llama en plural

    protected $fillable = [
        'pregunta_id',
        'user_id',
        'respuesta',
    ];

    // Relación con la tabla 'preguntas_encuesta'
    public function pregunta()
    {
        return $this->belongsTo(PreguntaEncuesta::class, 'pregunta_id');
    }

    // Relación con la tabla 'users'
    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}