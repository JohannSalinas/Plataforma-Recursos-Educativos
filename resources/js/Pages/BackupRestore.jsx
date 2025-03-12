import React, { useState } from 'react';
import { useForm } from '@inertiajs/inertia-react';
import { route } from 'ziggy-js';
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import { Link } from '@inertiajs/inertia-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const BackupRestore = () => {
    const [isRestoring, setIsRestoring] = useState(false);

    const { post: backupPost, processing: isBackingUp } = useForm({});
    const { post: restorePost, processing: isRestoringData } = useForm({});

    const handleBackup = async () => {
        console.log('Entrando en handleBackup');
        try {
            const response = await axios.post(route('backup-restore.backup'));
            console.log('Respuesta exitosa:', response);

            // Descargar el archivo recién creado
            const fileName = response.data.fileName;
            const downloadUrl = route('backup-restore.download-latest');

            console.log('Descargando archivo:', fileName);

            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            Swal.fire({
                icon: 'success',
                title: '¡Respaldo Exitoso!',
                text: 'Respaldo realizado exitosamente.',
                confirmButtonText: 'Cerrar',
                timer: 3000
            });
        } catch (error) {
            console.error('Error en la solicitud:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error durante el respaldo.',
                confirmButtonText: 'Cerrar',
                timer: 3000
            });
        }
    };

    const RestoreForm = () => {
        const [selectedFile, setSelectedFile] = useState(null);

        const handleFileChange = (e) => {
            setSelectedFile(e.target.files[0]);
        };

        const handleRestore = (e) => {
            e.preventDefault();

            if (!selectedFile) {
                Swal.fire({
                    icon: 'error',
                    title: 'Archivo no seleccionado',
                    text: 'Por favor seleccione un archivo de respaldo.',
                    confirmButtonText: 'Cerrar',
                    timer: 3000
                });
                return;
            }

            // Crear un nuevo FormData
            const formData = new FormData();
            formData.append('backup_file', selectedFile);

            // Hacer la petición usando el router de Inertia
            router.post(route('backup-restore.restore'), formData, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    // Alerta de éxito
                    Swal.fire({
                        icon: 'success',
                        title: '¡Restauración Exitosa!',
                        text: 'Base de datos restaurada exitosamente.',
                        confirmButtonText: 'Cerrar',
                        timer: 3000
                    });
                    setSelectedFile(null);
                    // Limpiar el input file
                    e.target.reset();
                },
                onError: (error) => {
                    // Alerta de error
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error.message || 'Error al restaurar la base de datos.',
                        confirmButtonText: 'Cerrar',
                        timer: 3000
                    });
                }
            });
        };

        return (
            <form onSubmit={handleRestore} encType="multipart/form-data">
                <div className="flex items-center gap-4 mb-4">
                    <input
                        type="file"
                        name="backup_file"
                        onChange={handleFileChange}
                        accept=".sql"
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-2 file:border-gray-300
                             file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700
                             hover:file:bg-violet-100 focus:ring-2 focus:ring-violet-500 transition"
                    />
                    <button
                        type="submit"
                        disabled={!selectedFile || isRestoringData}
                        className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700
                             disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {isRestoringData ? 'Restaurando...' : 'Restaurar Base de Datos'}
                    </button>
                </div>
                {selectedFile && (
                    <div className="mt-2 text-sm text-gray-600">
                        <span className="font-semibold">Archivo seleccionado:</span> {selectedFile.name}
                    </div>
                )}
            </form>
        );
    };

    return (
        <AuthenticatedLayout
            
        >
            <Head title="Respaldo y Restauración de Base de Datos" />

            <div className="min-h-screen bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 py-12">
                <div className="max-w-4xl mx-auto bg-white bg-opacity-60 p-6 rounded-lg shadow-lg backdrop-blur-lg">
                    {/* Sección de Respaldo */}
                    <div className="bg-white bg-opacity-60 p-6 rounded-lg shadow-md mb-6 backdrop-blur-lg">
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">Respaldo de Base de Datos</h2>
                        <button
                            onClick={handleBackup}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                            disabled={isBackingUp}
                        >
                            {isBackingUp ? 'Realizando Respaldo...' : 'Realizar Respaldo'}
                        </button>
                    </div>

                    {/* Sección de Restauración */}
                    <div className="bg-white bg-opacity-60 p-6 rounded-lg shadow-md backdrop-blur-lg">
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">Restauración de Base de Datos</h2>
                        <RestoreForm />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default BackupRestore;
