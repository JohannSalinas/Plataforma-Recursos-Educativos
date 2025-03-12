<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GrupoUsuario extends Model
{
    use HasFactory;

    protected $table = 'grupo_usuario';

    protected $fillable = [
        'grupo_id',
        'usuario_id',
    ];

    public function grupoColaborador()
    {
        return $this->belongsTo(GrupoColaborador::class, 'grupo_id');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}
