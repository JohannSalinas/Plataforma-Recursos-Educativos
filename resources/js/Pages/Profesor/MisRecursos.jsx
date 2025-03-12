import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function RecursosEducativos() {
    const { recursos = [], grupos = [] } = usePage().props; // Obtenemos los recursos educativos desde las props pasadas por Inertia
    console.log(recursos);
    // Estado para el formulario de creación de recurso
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        tipo: '',
        archivo: null,
        grupo_id: '', // Asegúrate de agregar este campo
    });

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData({
                ...formData,
                [name]: files[0],
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const form = new FormData();
        form.append('titulo', formData.titulo);
        form.append('descripcion', formData.descripcion);
        form.append('tipo', formData.tipo);
        form.append('archivo', formData.archivo);
        form.append('grupo_id', formData.grupo_id);

        router.post('/recursos/crear', form, {
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: '¡Recurso creado!',
                    text: 'El recurso ha sido creado correctamente.',
                    confirmButtonColor: '#1E88E5',
                });
                setFormData({ titulo: '', descripcion: '', tipo: '', archivo: null, grupo_id: '' }); // Limpiar formulario
            },
            onError: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un problema al crear el recurso.',
                    confirmButtonColor: '#d33',
                });
            },
        });
    };

    const handleDelete = (recursoId) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Deseas eliminar el recurso con ID: ${recursoId}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/recursos/${recursoId}`, {
                    onSuccess: () => {
                        Swal.fire({
                            icon: 'success',
                            title: '¡Eliminado!',
                            text: 'El recurso ha sido eliminado correctamente.',
                            confirmButtonColor: '#1E88E5',
                        });
                    },
                    onError: () => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Ocurrió un problema al eliminar el recurso.',
                            confirmButtonColor: '#d33',
                        });
                    },
                });
            }
        });
    };

    return (
        <AuthenticatedLayout

        >
            <Head title="Administrar Recursos Educativos" />

            <div className="relative bg-gradient-to-r from-teal-400 to-blue-500 text-white min-h-screen flex flex-col items-center justify-center py-12">
               
                

                {/* Contenedor principal */}
                <div className="relative bg-white bg-opacity-60 text-gray-800 shadow-lg rounded-2xl p-8 max-w-7xl w-full space-y-6">
                    <h1 className="text-4xl font-extrabold mb-4 text-gray-800">
                        Crear un nuevo recurso educativo
                    </h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Título
                            </label>
                            <input
                                type="text"
                                id="titulo"
                                name="titulo"
                                value={formData.titulo}
                                onChange={handleInputChange}
                                className="mt-2 block w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
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
                                className="mt-2 block w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Tipo
                            </label>
                            <select
                                id="tipo"
                                name="tipo"
                                value={formData.tipo}
                                onChange={handleInputChange}
                                className="mt-2 block w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                            >
                                <option value="">Seleccionar tipo</option>
                                <option value="PDF">PDF</option>
                                <option value="DOCX">DOCX</option>
                                <option value="PPTX">PPTX</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="grupo_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Selecciona el Grupo
                            </label>
                            <select
                                name="grupo_id"
                                id="grupo_id"
                                value={formData.grupo_id}
                                onChange={handleInputChange}
                                className="mt-2 block w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                            >
                                <option value="">Selecciona un grupo</option>
                                {grupos.length > 0 ? (
                                    grupos.map((grupo) => (
                                        <option key={grupo.id} value={grupo.id}>
                                            {grupo.nombre}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>No hay grupos disponibles</option>
                                )}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="archivo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Archivo
                            </label>
                            <input
                                type="file"
                                id="archivo"
                                name="archivo"
                                onChange={handleInputChange}
                                className="mt-2 block w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-teal-600 text-white py-3 px-6 rounded-xl hover:bg-teal-700 transition duration-300 transform hover:scale-105"
                        >
                            Crear Recurso
                        </button>
                    </form>


                    {/* Tabla de recursos existentes */}
                    {/* Tabla de recursos existentes */}
                    <div className="overflow-x-auto w-full mt-8">
                        <table className="w-full border-collapse shadow-lg rounded-2xl overflow-hidden">
                        {/* Encabezado */}
                        <thead className="bg-gradient-to-r from-teal-500 to-blue-500 text-white">
                    <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">ID</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Título</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Tipo</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Usuario</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Acciones</th>
                    </tr>
                        </thead>

                    {/* Cuerpo de la tabla */}
                    <tbody className="bg-white divide-y divide-gray-200">
                        {recursos.map((recurso, index) => (
                    <tr key={recurso.id} className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-gray-200 transition`}>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{recurso.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{recurso.titulo}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{recurso.tipo}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{recurso.user.nombre || 'Desconocido'}</td>
                        <td className="px-6 py-4 flex space-x-2">
                            <button
                                className="px-4 py-2 text-white bg-red-500 rounded-lg shadow-md hover:bg-red-600 transition duration-300 transform hover:scale-105"
                                onClick={() => handleDelete(recurso.id)}
                            >
                                Eliminar
                            </button>
                            <Link
                                href={`/recursos/${recurso.id}/editar`}
                                className="px-4 py-2 text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 transform hover:scale-105"
                            >
                                Modificar
                            </Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    </div>
            </div>
        </AuthenticatedLayout>
    );
}
