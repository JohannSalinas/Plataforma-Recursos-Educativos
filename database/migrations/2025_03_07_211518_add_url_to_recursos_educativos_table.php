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
            // Agregar el campo url nuevamente
            $table->string('url')->nullable()->after('tipo'); // Puedes cambiar 'after' según la posición deseada

            // Cambiar el valor por defecto de calificacion a 0.0
            $table->decimal('calificacion', 2, 1)->default(0.0)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('recursos_educativos', function (Blueprint $table) {
            // Eliminar el campo url en caso de rollback
            $table->dropColumn('url');

            // Restaurar el valor por defecto de calificacion a 1.0
            $table->decimal('calificacion', 2, 1)->default(1.0)->change();
        });
    }
};
