<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RespuestaForo extends Model
{
    use HasFactory;

    protected $table = 'respuestas_foro';

    protected $fillable = ['pregunta_id', 'usuario_id', 'respuesta'];

    public function pregunta()
    {
        return $this->belongsTo(PreguntaForo::class, 'pregunta_id');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class);
    }
}
