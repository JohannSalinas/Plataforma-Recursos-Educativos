<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('preguntas_foro', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('users')->onDelete('cascade');
            $table->text('pregunta');
            $table->tinyInteger('max_respuestas')->default(5); // Por defecto 5 respuestas permitidas
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('preguntas_foro');
    }
};
