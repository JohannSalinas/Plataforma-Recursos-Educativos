import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function GestionNoticias() {
    const { noticias } = usePage().props;

    // Estado del formulario
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        lugar: '',
        fecha_evento: '',
        imagen: null,
    });

    // Estado para errores
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const today = new Date().toISOString().split('T')[0];
        if (formData.fecha_evento < today) {
            setError('La fecha del evento no puede ser anterior a la actual.');
            return;
        }

        setError('');

        const form = new FormData();
        form.append('titulo', formData.titulo);
        form.append('descripcion', formData.descripcion);
        form.append('lugar', formData.lugar);
        form.append('fecha_evento', formData.fecha_evento);
        form.append('imagen', formData.imagen);

        router.post('/noticias', form, {
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: '¡Noticia creada!',
                    text: 'La noticia se ha creado correctamente.',
                    confirmButtonColor: '#4CAF50'
                });

                setFormData({
                    titulo: '',
                    descripcion: '',
                    lugar: '',
                    fecha_evento: '',
                    imagen: null
                });
            },
            onError: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un problema al crear la noticia.',
                    confirmButtonColor: '#F44336'
                });
            },
        });
    };

    const handleDelete = (noticiaId) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará la noticia de forma permanente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/noticias/${noticiaId}`, {
                    onSuccess: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Eliminado',
                            text: 'La noticia ha sido eliminada.',
                            confirmButtonColor: '#4CAF50'
                        });
                    },
                    onError: () => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'No se pudo eliminar la noticia.',
                            confirmButtonColor: '#F44336'
                        });
                    }
                });
            }
        });
    };

    return (
        <AuthenticatedLayout
            
        >
            <Head title="Administrar Noticias" />

            <div className="min-h-screen bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="relative bg-white bg-opacity-60 text-gray-800 shadow-lg rounded-2xl p-8 max-w-7xl w-full space-y-6">
                        {/* Formulario de creación de noticias */}
                        <h3 className="text-4xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            Crear una nueva noticia
                        </h3>
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
                                <label htmlFor="lugar" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Lugar
                                </label>
                                <input
                                    type="text"
                                    id="lugar"
                                    name="lugar"
                                    value={formData.lugar}
                                    onChange={handleInputChange}
                                    className="mt-2 block w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                />
                            </div>
                            <div>
                                <label htmlFor="fecha_evento" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Fecha del Evento
                                </label>
                                <input
                                    type="date"
                                    id="fecha_evento"
                                    name="fecha_evento"
                                    value={formData.fecha_evento}
                                    onChange={handleInputChange}
                                    className="mt-2 block w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                />
                                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                            </div>
                            <div>
                                <label htmlFor="imagen" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Imagen
                                </label>
                                <input
                                    type="file"
                                    id="imagen"
                                    name="imagen"
                                    onChange={handleInputChange}
                                    className="mt-2 block w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-teal-600 text-white py-3 px-6 rounded-xl hover:bg-teal-700 transition duration-300 transform hover:scale-105"
                            >
                                Crear Noticia
                            </button>
                        </form>

                        {/* Tabla de noticias */}
                        <div className="overflow-x-auto w-full mt-8">
                            <table className="w-full border-collapse shadow-lg rounded-2xl overflow-hidden">
                                {/* Encabezado */}
                                <thead className="bg-gradient-to-r from-teal-500 to-blue-500 text-white">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">ID</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Título</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Lugar</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Fecha Evento</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Acciones</th>
                                    </tr>
                                </thead>
                                {/* Cuerpo de la tabla */}
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {noticias.map((noticia, index) => (
                                        <tr key={noticia.id} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-200 transition`}>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">{noticia.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{noticia.titulo}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{noticia.lugar}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{noticia.fecha_evento}</td>
                                            <td className="px-6 py-4 flex space-x-2">
                                                <button
                                                    className="px-4 py-2 text-white bg-red-500 rounded-lg shadow-md hover:bg-red-600 transition duration-300 transform hover:scale-105"
                                                    onClick={() => handleDelete(noticia.id)}
                                                >
                                                    Eliminar
                                                </button>
                                                <Link
                                                    href={`/noticias/${noticia.id}/editar`}
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
