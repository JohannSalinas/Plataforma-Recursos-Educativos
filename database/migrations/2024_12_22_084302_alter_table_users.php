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
        Schema::table('users', function (Blueprint $table) {
            $table->enum('genero',['masculino','femenino','otro'])->default('otro');
            $table->renameColumn('name','nombre');
            $table->string('apellidos')->nullable();
            $table->enum('gradoAcademico',['licenciatura','maestria','doctorado']);
            $table->date('fechaNacimiento')->nullable();
            $table->string('foto')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('genero');
            $table->dropColumn('nombre');
            $table->dropColumn('apellidos');
            $table->dropColumn('gradoAcademico');
            $table->dropColumn('fechaNacimiento');
            $table->dropColumn('foto');
        });
    }
};
