<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEncuestasTable extends Migration
{
    /**
     * Ejecuta la migración.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('encuestas', function (Blueprint $table) {
            $table->id(); // La columna ID que se autoincrementa
            $table->string('titulo'); // Columna para el título de la encuesta
            $table->text('descripcion')->nullable(); // Columna para la descripción
            $table->text('preguntas')->nullable(); // Columna para las preguntas
            $table->foreignId('user_id')->constrained('users', 'id')->onDelete('cascade'); // Relación con la tabla users
            $table->timestamp('fecha_creacion')->useCurrent(); // Fecha de creación con valor por defecto al momento de la inserción
        });
    }

    /**
     * Revierte la migración.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('encuestas');
    }
}
