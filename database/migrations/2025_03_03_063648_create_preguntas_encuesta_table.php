<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('preguntas_encuesta', function (Blueprint $table) {
            $table->id();
            $table->foreignId('encuesta_id')->constrained('encuestas')->onDelete('cascade'); // Relación con encuestas
            $table->string('pregunta'); // Texto de la pregunta
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('preguntas_encuesta');
    }
};

