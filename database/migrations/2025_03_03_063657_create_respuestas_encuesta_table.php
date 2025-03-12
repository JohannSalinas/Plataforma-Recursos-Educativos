<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('respuestas_encuesta', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pregunta_id')->constrained('preguntas_encuesta')->onDelete('cascade'); // Relación con preguntas_encuesta
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Usuario que responde
            $table->enum('respuesta', ['Totalmente de acuerdo', 'De acuerdo', 'Neutral', 'En desacuerdo', 'Totalmente en desacuerdo']); // Opciones de respuesta
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('respuestas_encuesta');
    }
};

