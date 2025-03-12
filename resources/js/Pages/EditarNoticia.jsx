import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function EditarNoticias({ noticia }) {
    const { data, setData, post, errors } = useForm({
        titulo: noticia.titulo,
        descripcion: noticia.descripcion,
        lugar: noticia.lugar,
        fecha_evento: noticia.fecha_evento,
        imagen: noticia.imagen, // Imagen existente
    });

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'imagen') {
            if (files && files.length > 0) {
                setData(name, files[0]); // Guarda la nueva imagen si el usuario selecciona una
            } else {
                setData(name, noticia.imagen); // Mantiene la imagen original si no se selecciona una nueva
            }
        } else {
            setData(name, value); // Para otros campos, actualiza el valor normalmente
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        post(`/noticias/${noticia.id}`, {
            onSuccess: () => {
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Noticia actualizada correctamente.',
                    icon: 'success',
                    confirmButtonColor: '#2563eb',
                });
            },
            onError: () => {
                Swal.fire({
                    title: 'Error',
                    text: 'Ocurrió un error al actualizar la noticia.',
                    icon: 'error',
                    confirmButtonColor: '#dc2626',
                });
            },
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Editar Noticia</h2>}>
            <Head title="Editar Noticia" />

            {/* Fondo degradado azul a verde */}
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-green-500 px-4">
                <div className="max-w-3xl w-full">
                    {/* Formulario con opacidad y desenfoque */}
                    <div className="bg-white dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-75 backdrop-blur-lg shadow-xl rounded-xl p-8">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 text-center mb-6">
                            Editar Noticia
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Título
                                </label>
                                <input
                                    type="text"
                                    id="titulo"
                                    name="titulo"
                                    value={data.titulo}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                                />
                                {errors.titulo && <p className="text-red-500 text-sm mt-2">{errors.titulo}</p>}
                            </div>
                            <div>
                                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Descripción
                                </label>
                                <textarea
                                    id="descripcion"
                                    name="descripcion"
                                    value={data.descripcion}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                                ></textarea>
                                {errors.descripcion && <p className="text-red-500 text-sm mt-2">{errors.descripcion}</p>}
                            </div>
                            <div>
                                <label htmlFor="lugar" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Lugar
                                </label>
                                <input
                                    type="text"
                                    id="lugar"
                                    name="lugar"
                                    value={data.lugar}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                                />
                                {errors.lugar && <p className="text-red-500 text-sm mt-2">{errors.lugar}</p>}
                            </div>
                            <div>
                                <label htmlFor="fecha_evento" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Fecha del Evento
                                </label>
                                <input
                                    type="date"
                                    id="fecha_evento"
                                    name="fecha_evento"
                                    value={data.fecha_evento}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                                />
                                {errors.fecha_evento && <p className="text-red-500 text-sm mt-2">{errors.fecha_evento}</p>}
                            </div>
                            <div>
                                <label htmlFor="imagen" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Imagen
                                </label>
                                <input
                                    id="imagen"
                                    name="imagen"
                                    type="file"
                                    className="mt-2 block w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                    onChange={handleInputChange}
                                    accept="image/*"
                                />
                                {errors.imagen && <p className="text-red-500 text-sm mt-2">{errors.imagen}</p>}
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white p-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                            >
                                Guardar Cambios
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
