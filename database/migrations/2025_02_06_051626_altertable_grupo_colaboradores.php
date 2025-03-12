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
        Schema::table('grupos_colaboradores', function (Blueprint $table) {
            $table->unsignedBigInteger('creador_id')->after('id'); //  Agregar creador_id
            $table->foreign('creador_id')->references('id')->on('users')->onDelete('cascade'); // Clave foránea
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('grupos_colaboradores', function (Blueprint $table) {
            $table->dropForeign(['creador_id']); //  Eliminar la clave foránea
            $table->dropColumn('creador_id'); //  Remover la columna si se revierte
        });
    }
};
