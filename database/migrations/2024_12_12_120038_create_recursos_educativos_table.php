<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('recursos_educativos', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->text('descripcion')->nullable();
            $table->enum('tipo', ['PDF', 'DOCX', 'PPTX', 'Enlace Web']);
            $table->string('url')->nullable(); // URL externa del recurso
            $table->string('archivo_path')->nullable(); // Ruta del archivo subido
            $table->foreignId('user_id')
                  ->constrained()
                  ->onDelete('cascade'); // Relaciona con la tabla de usuarios
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recursos_educativos');
    }
};