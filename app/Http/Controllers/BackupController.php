<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class BackupController extends Controller
{
    public function index()
    {
        return Inertia::render('BackupRestore');
    }

    // ✅ Acción para realizar el respaldo de la base de datos
    public function backup()
    {
        try {
            if (!Storage::exists('public/backups')) {
                Storage::makeDirectory('public/backups');
            }

            $fileName = 'backup_' . now()->format('Ymd_His') . '.sql';
            $backupPath = storage_path("app/public/backups/{$fileName}");

            // Configuración de la base de datos
            $dbHost = config('database.connections.mysql.host', '127.0.0.1');
            $dbUser = config('database.connections.mysql.username');
            $dbPass = config('database.connections.mysql.password');
            $dbName = config('database.connections.mysql.database');

            // Construcción del comando
            $command = sprintf(
                '"%s" --host=%s --user=%s --password=%s %s > "%s"',
                env('MYSQL_DUMP_PATH'),
                escapeshellarg($dbHost),
                escapeshellarg($dbUser),
                escapeshellarg($dbPass),
                escapeshellarg($dbName),
                $backupPath
            );

            exec($command, $output, $resultCode);

            // Verificar si el backup se creó correctamente
            if ($resultCode !== 0 || !file_exists($backupPath) || filesize($backupPath) === 0) {
                Log::error('Error en backup: Código ' . $resultCode . ', Output: ' . implode("\n", $output));
                throw new \Exception('El archivo de respaldo está vacío o no se pudo crear.');
            }

            Log::info('Backup creado: ' . $backupPath . ' - Tamaño: ' . filesize($backupPath) . ' bytes');

            // Devolver información sobre el archivo creado
            return response()->json([
                'success' => true,
                'message' => 'Backup creado exitosamente',
                'fileName' => $fileName
            ]);

        } catch (\Exception $e) {
            Log::error('Error en backup: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error al realizar el respaldo: ' . $e->getMessage()
            ], 500);
        }
    }

    public function downloadLatestBackup()
    {
        try {
            // Directorio donde se almacenan los backups
            $backupDir = storage_path('app/public/backups');

            // Verificar si existe el directorio
            if (!is_dir($backupDir)) {
                return response()->json([
                    'success' => false,
                    'message' => 'El directorio de backups no existe'
                ], 404);
            }

            // Obtener todos los archivos de backup
            $files = glob($backupDir . '/*.sql');

            // Verificar si hay archivos
            if (empty($files)) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se encontraron archivos de backup'
                ], 404);
            }

            // Ordenar archivos por fecha de modificación (el más reciente primero)
            usort($files, function($a, $b) {
                return filemtime($b) - filemtime($a);
            });

            // Obtener el archivo más reciente
            $latestBackup = $files[0];
            $fileName = basename($latestBackup);

            // Verificar si el archivo existe y no está vacío
            if (!file_exists($latestBackup) || filesize($latestBackup) === 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'El archivo de backup está vacío o no existe'
                ], 404);
            }

            // Log para depuración
            Log::info('Descargando backup más reciente: ' . $latestBackup . ' - Tamaño: ' . filesize($latestBackup) . ' bytes');

            // Retornar el archivo para su descarga
            return response()->download($latestBackup, $fileName);

        } catch (\Exception $e) {
            Log::error('Error al descargar backup: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error al descargar el backup: ' . $e->getMessage()
            ], 500);
        }
    }


    public function restore(Request $request)
    {
        try {
            if (!$request->hasFile('backup_file')) {
                throw new \Exception('No se ha seleccionado ningún archivo de respaldo.');
            }

            $file = $request->file('backup_file');

            // Validar que sea un archivo SQL
            if ($file->getClientOriginalExtension() !== 'sql') {
                throw new \Exception('El archivo debe ser de tipo SQL.');
            }

            // Guardar el archivo temporalmente
            $tempPath = storage_path('app/temp/') . $file->getClientOriginalName();
            if (!Storage::exists('temp')) {
                Storage::makeDirectory('temp');
            }

            $file->move(storage_path('app/temp/'), $file->getClientOriginalName());

            // Configuración de la base de datos
            $dbHost = config('database.connections.mysql.host', '127.0.0.1');
            $dbUser = config('database.connections.mysql.username');
            $dbPass = config('database.connections.mysql.password');
            $dbName = config('database.connections.mysql.database');

            // Construir el comando de restauración
            $command = sprintf(
                '"%s" --host=%s --user=%s --password=%s %s < "%s"',
                env('MYSQL_PATH'),
                escapeshellarg($dbHost),
                escapeshellarg($dbUser),
                escapeshellarg($dbPass),
                escapeshellarg($dbName),
                $tempPath
            );

            // Ejecutar el comando
            $output = null;
            $resultCode = null;
            exec($command, $output, $resultCode);

            // Eliminar el archivo temporal
            unlink($tempPath);

            if ($resultCode !== 0) {
                Log::error('Error en restauración: Código ' . $resultCode . ', Output: ' . implode("\n", $output));
                throw new \Exception('Error al restaurar la base de datos.');
            }

            Log::info('Restauración completada exitosamente');

            

        } catch (\Exception $e) {
            Log::error('Error en restauración: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error al restaurar la base de datos: ' . $e->getMessage()
            ], 500);
        }
    }
}
