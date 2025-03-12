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
        Schema::create('calificaciones_recursos', function (Blueprint $table) {
            $table->id(); // ID único de la calificación
            $table->unsignedBigInteger('recurso_id'); // ID del recurso educativo
            $table->unsignedBigInteger('user_id'); // ID del usuario que calificó
            $table->decimal('calificacion', 2, 1); // Calificación (0.0 - 5.0)
            $table->timestamps(); // created_at y updated_at

            // Claves foráneas
            $table->foreign('recurso_id')->references('id')->on('recursos_educativos')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            // Restricción única: un usuario solo puede calificar un recurso una vez
            $table->unique(['recurso_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('calificaciones_recursos');
    }
};