<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddVisibleToNotificacionesTable extends Migration
{
    /**
     * Ejecuta las migraciones.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('notificaciones_unirse_grupo', function (Blueprint $table) {
            // Agregar la columna 'visible', con valor por defecto 'true'
            $table->boolean('visible')->default(true);
        });
    }

    /**
     * Revierte las migraciones.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('notificaciones_unirse_grupo', function (Blueprint $table) {
            // Eliminar la columna 'visible' si revertimos la migración
            $table->dropColumn('visible');
        });
    }
}
