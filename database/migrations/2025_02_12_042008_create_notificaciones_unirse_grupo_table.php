<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('notificaciones_unirse_grupo', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_usuario_solicitante');
            $table->unsignedBigInteger('id_usuario_creador_grupo');
            $table->unsignedBigInteger('id_grupo');
            $table->enum('estatus', ['pendiente', 'aceptado', 'rechazado'])->default('pendiente');
            $table->timestamps();

            // Claves foráneas
            $table->foreign('id_usuario_solicitante')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('id_usuario_creador_grupo')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('id_grupo')->references('id')->on('grupos_colaboradores')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notificaciones_unirse_grupo');
    }
};
