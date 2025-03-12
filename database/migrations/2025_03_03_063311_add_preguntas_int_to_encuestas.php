<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up()
    {
        Schema::table('encuestas', function (Blueprint $table) {
            $table->integer('preguntas_nuevo')->nullable()->after('preguntas');
        });
    }

    public function down()
    {
        Schema::table('encuestas', function (Blueprint $table) {
            $table->dropColumn('preguntas_nuevo');
        });
    }
};
