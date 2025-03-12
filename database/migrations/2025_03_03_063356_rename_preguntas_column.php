<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('encuestas', function (Blueprint $table) {
            $table->dropColumn('preguntas'); // Eliminar la columna antigua
            $table->renameColumn('preguntas_nuevo', 'preguntas'); // Renombrar la nueva columna
        });
    }

    public function down()
    {
        Schema::table('encuestas', function (Blueprint $table) {
            $table->string('preguntas')->nullable();
            $table->dropColumn('preguntas');
        });
    }
};
