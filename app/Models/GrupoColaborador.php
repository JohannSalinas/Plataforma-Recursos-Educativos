<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GrupoColaborador extends Model
{
    use HasFactory;

    // Especificamos explícitamente el nombre de la tabla
    protected $table = 'grupos_colaboradores';

    // Definir los campos que pueden ser asignados masivamente
    protected $fillable = [
        'nombre',
        'tipo',
        'descripcion',
        'temas_abordados',
        'numero_inscritos',
        'creador_id',
    ];

    public function grupoUsuarios()
    {
        return $this->hasMany(GrupoUsuario::class, 'grupo_id');
    }
    
    public function recursosEducativos()
    {
        return $this->hasMany(RecursoEducativo::class, 'grupo_id');
    }
    public function usuarios()
    {   
    return $this->hasManyThrough(User::class, GrupoUsuario::class, 'grupo_id', 'id', 'id', 'usuario_id');
    }
    // Relación con RecursoEducativo
    public function recursos()
    {
        return $this->hasMany(RecursoEducativo::class, 'grupo_colaborador_id'); // Asegúrate de que el campo 'grupo_colaborador_id' exista en la tabla de recursos
    }

}
