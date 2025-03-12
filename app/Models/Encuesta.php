<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Encuesta extends Model
{
    use HasFactory;

    // Tabla asociada
    protected $table = 'encuestas';

    // No timestamps por defecto
    public $timestamps = false;

    // Asignación masiva permitida
    protected $fillable = ['titulo', 'descripcion', 'preguntas', 'user_id', 'fecha_creacion'];

    // Relación con el modelo User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relación con las preguntas
    public function preguntas()
    {
        return $this->hasMany(PreguntaEncuesta::class);
    }
    
    public function preguntas_encuesta()
    {
        return $this->hasMany(PreguntaEncuesta::class);
    }
}
