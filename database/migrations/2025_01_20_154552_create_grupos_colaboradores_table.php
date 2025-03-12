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
        Schema::create('grupos_colaboradores', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('tipo', 100)->nullable();
            $table->text('descripcion')->nullable();
            $table->text('temas_abordados')->nullable();
            $table->integer('numero_inscritos')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grupos_colaboradores');
    }
};
