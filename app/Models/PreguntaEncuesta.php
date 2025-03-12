<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PreguntaEncuesta extends Model
{
    use HasFactory;

    // Tabla asociada
    protected $table = 'preguntas_encuesta';

    // Asignación masiva permitida
    protected $fillable = ['encuesta_id', 'pregunta'];

    // Relación con el modelo Encuesta
    public function encuesta()
    {
        return $this->belongsTo(Encuesta::class);
    }
    // Relación con la tabla respuestas_encuesta
    public function respuestas(): HasMany
    {
        return $this->hasMany(RespuestasEncuesta::class, 'pregunta_id');
    }
}
