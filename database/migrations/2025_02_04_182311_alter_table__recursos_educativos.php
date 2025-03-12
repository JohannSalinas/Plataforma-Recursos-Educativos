<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('recursos_educativos', function (Blueprint $table) {
            $table->foreignId('grupo_colaborador_id')
                ->nullable()
                ->constrained('grupos_colaboradores')
                ->onDelete('set null'); // Si el grupo se elimina, los recursos no se perderán
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('recursos_educativos', function (Blueprint $table) {
            $table->dropForeign(['grupo_colaborador_id']);
            $table->dropColumn('grupo_colaborador_id');
        });
    }
};
