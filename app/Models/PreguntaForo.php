<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PreguntaForo extends Model
{
    use HasFactory;

    protected $table = 'preguntas_foro';

    protected $fillable = ['usuario_id', 'pregunta', 'max_respuestas'];

    public function usuario()
    {
        return $this->belongsTo(User::class);
    }

    public function respuestas()
    {
        return $this->hasMany(RespuestaForo::class, 'pregunta_id');
    }
}
