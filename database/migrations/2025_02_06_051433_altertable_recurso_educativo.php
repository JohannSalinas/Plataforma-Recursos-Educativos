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
        Schema::table('recursos_educativos', function (Blueprint $table) {
            $table->dropColumn('url'); //  Eliminar la columna url
            $table->decimal('calificacion', 2, 1)->default(1.0); //  Agregar calificación (1.0 - 5.0)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('recursos_educativos', function (Blueprint $table) {
            $table->string('url')->nullable(); //  Restaurar url en rollback
            $table->dropColumn('calificacion'); // Quitar calificación si se revierte
        });
    }
};
