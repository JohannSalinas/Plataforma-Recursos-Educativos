<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Noticia extends Model
{
    use HasFactory;

    protected $table = 'noticias';

    protected $fillable = [
        'titulo',
        'descripcion',
        'imagen',
        'lugar',
        'fecha_evento',
    ];

    public $timestamps = false; // No usamos las columnas `created_at` y `updated_at`
}
