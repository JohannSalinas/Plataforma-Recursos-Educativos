import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function GestionGruposColaboradores() {
    const { grupos } = usePage().props;

    const [formData, setFormData] = useState({
        nombre: '',
        tipo: '',
        descripcion: '',
        temas_abordados: '',
    });

    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setError('');
        
        // Validación simple para asegurarse de que todos los campos estén llenos
        if (!formData.nombre || !formData.tipo || !formData.descripcion || !formData.temas_abordados) {
            setError('Por favor, complete todos los campos.');
            return;
        }

        const form = new FormData();
        form.append('nombre', formData.nombre);
        form.append('tipo', formData.tipo);
        form.append('descripcion', formData.descripcion);
        form.append('temas_abordados', formData.temas_abordados);

        router.post('/grupos-colaboradores', form, {
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: '¡Grupo creado!',
                    text: 'El grupo de colaboradores ha sido creado correctamente.',
                    confirmButtonColor: '#4CAF50'
                });
                setFormData({ nombre: '', tipo: '', descripcion: '', temas_abordados: '' });
            },
            onError: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un problema al crear el grupo de colaboradores.',
                    confirmButtonColor: '#F44336'
                });
            },
        });
    };

    const handleDelete = (grupoId) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: `Esta acción eliminará el grupo con ID: ${grupoId} de forma permanente.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/grupos-colaboradores/${grupoId}`, {
                    onSuccess: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Eliminado',
                            text: 'El grupo de colaboradores ha sido eliminado.',
                            confirmButtonColor: '#4CAF50'
                        });
                    },
                    onError: () => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'No se pudo eliminar el grupo de colaboradores.',
                            confirmButtonColor: '#F44336'
                        });
                    },
                });
            }
        });
    };

    return (
        <AuthenticatedLayout
            
        >
            <Head title="Administrar Grupos de Colaboradores" />

            <div className="min-h-screen bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="relative bg-white bg-opacity-60 text-gray-800 shadow-lg rounded-2xl p-8 max-w-7xl w-full space-y-6">
                        {/* Formulario de creación de grupo */}
                        <h3 className="text-4xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Crear un nuevo grupo de colaboradores</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                    className="mt-2 block w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
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
                                <label htmlFor="temas_abordados" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Temas Abordados
                                </label>
                                <textarea
                                    id="temas_abordados"
                                    name="temas_abordados"
                                    value={formData.temas_abordados}
                                    onChange={handleInputChange}
                                    className="mt-2 block w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                ></textarea>
                            </div>
                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                            <button
                                type="submit"
                                className="w-full bg-teal-600 text-white py-3 px-6 rounded-xl hover:bg-teal-700 transition duration-300 transform hover:scale-105"
                            >
                                Crear Grupo de Colaboradores
                            </button>
                        </form>

                        {/* Tabla de grupos */}
                        <div className="overflow-x-auto w-full mt-8">
                            <table className="w-full border-collapse shadow-lg rounded-2xl overflow-hidden">
                                {/* Encabezado */}
                                <thead className="bg-gradient-to-r from-teal-500 to-blue-500 text-white">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">ID</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Nombre</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Tipo</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Descripción</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Temas Abordados</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Acciones</th>
                                    </tr>
                                </thead>
                                {/* Cuerpo de la tabla */}
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {grupos.map((grupo) => (
                                        <tr key={grupo.id} className="hover:bg-gray-200 transition">
                                            <td className="px-6 py-4 text-sm text-gray-900">{grupo.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{grupo.nombre}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{grupo.tipo}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{grupo.descripcion}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{grupo.temas_abordados}</td>
                                            <td className="px-6 py-4 flex space-x-2">
                                                <button
                                                    className="px-4 py-2 text-white bg-red-500 rounded-lg shadow-md hover:bg-red-600 transition duration-300 transform hover:scale-105"
                                                    onClick={() => handleDelete(grupo.id)}
                                                >
                                                    Eliminar
                                                </button>
                                                <Link
                                                    href={`/grupos-colaboradores/${grupo.id}/editar`}
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
            </div>
        </AuthenticatedLayout>
    );
}
