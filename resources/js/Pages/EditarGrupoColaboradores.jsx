import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function EditarGrupoColaboradores() {
    const { grupoColaborador, flash } = usePage().props;

    const [formData, setFormData] = useState({
        nombre: grupoColaborador.nombre || '',
        tipo: grupoColaborador.tipo || '',
        descripcion: grupoColaborador.descripcion || '',
        temas_abordados: grupoColaborador.temas_abordados || '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        router.put(`/grupos-colaboradores/${grupoColaborador.id}`, formData, {
            onSuccess: () => {
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Grupo de colaboradores actualizado correctamente.',
                    icon: 'success',
                    confirmButtonColor: '#2563eb',
                }).then(() => {
                    router.visit('/grupos-colaboradores');
                });
            },
            onError: () => {
                Swal.fire({
                    title: 'Error',
                    text: 'Ocurrió un error al actualizar el grupo de colaboradores.',
                    icon: 'error',
                    confirmButtonColor: '#dc2626',
                });
            },
        });
    };

    useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                title: '¡Éxito!',
                text: flash.success,
                icon: 'success',
                confirmButtonColor: '#2563eb',
            });
        }
    }, [flash]);

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Editar Grupo de Colaboradores</h2>}
        >
            <Head title="Editar Grupo de Colaboradores" />

            {/* Fondo degradado azul a verde */}
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-green-500 px-4">
                <div className="max-w-3xl w-full">
                    {/* Formulario con opacidad y desenfoque */}
                    <div className="bg-white dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-75 backdrop-blur-lg shadow-xl rounded-xl p-8">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 text-center mb-6">
                            Editar Grupo de Colaboradores
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                                />
                            </div>
                            <div>
                                <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Tipo
                                </label>
                                <input
                                    type="text"
                                    id="tipo"
                                    name="tipo"
                                    value={formData.tipo}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                                />
                            </div>
                            <div>
                                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Descripción
                                </label>
                                <textarea
                                    id="descripcion"
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                                ></textarea>
                            </div>
                            <div>
                                <label htmlFor="temas_abordados" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Temas Abordados
                                </label>
                                <textarea
                                    id="temas_abordados"
                                    name="temas_abordados"
                                    value={formData.temas_abordados}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white p-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                            >
                                Actualizar Grupo
                            </button>
                        </form>

                        
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
