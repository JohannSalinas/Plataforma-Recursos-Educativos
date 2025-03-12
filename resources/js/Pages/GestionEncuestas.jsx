import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function GestionEncuestas() {
    const { encuestas } = usePage().props;

    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        numPreguntas: 1, // Valor inicial para el número de preguntas
        preguntas: [''], // Pregunta inicial vacía
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handlePreguntaChange = (index, e) => {
        const updatedPreguntas = [...formData.preguntas];
        updatedPreguntas[index] = e.target.value;
        setFormData({
            ...formData,
            preguntas: updatedPreguntas,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validar que el número de preguntas esté entre 1 y 10
        if (formData.numPreguntas < 1 || formData.numPreguntas > 10) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El número de preguntas debe estar entre 1 y 10.',
                confirmButtonColor: '#F44336'
            });
            return;
        }

        // Usar FormData para enviar los datos como un formulario
        const form = new FormData();
        form.append('titulo', formData.titulo);
        form.append('descripcion', formData.descripcion);
        form.append('numPreguntas', formData.numPreguntas);

        // Enviar cada pregunta individualmente como un campo
        formData.preguntas.forEach((pregunta, index) => {
            form.append(`preguntas[${index}]`, pregunta);
        });

        router.post('/encuestas', form, {
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: '¡Encuesta creada!',
                    text: 'La encuesta se ha creado correctamente.',
                    confirmButtonColor: '#4CAF50'
                });
                setFormData({ titulo: '', descripcion: '', numPreguntas: 1, preguntas: [''] });
            },
            onError: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un problema al crear la encuesta.',
                    confirmButtonColor: '#F44336'
                });
            },
        });
    };

    const handleDelete = (encuestaId) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará la encuesta de forma permanente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/encuestas/${encuestaId}`, {
                    onSuccess: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Eliminado',
                            text: 'La encuesta ha sido eliminada.',
                            confirmButtonColor: '#4CAF50'
                        });
                    },
                    onError: () => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'No se pudo eliminar la encuesta.',
                            confirmButtonColor: '#F44336'
                        });
                    }
                });
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Administrar Encuestas" />

            <div className="min-h-screen bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="relative bg-white bg-opacity-60 text-gray-800 shadow-lg rounded-2xl p-8 max-w-7xl w-full space-y-6">
                        {/* Formulario de creación de encuestas */}
                        <h3 className="text-4xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            Crear una nueva encuesta
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
                                <label htmlFor="numPreguntas" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Número de Preguntas
                                </label>
                                <input
                                    type="number"
                                    id="numPreguntas"
                                    name="numPreguntas"
                                    value={formData.numPreguntas}
                                    min="1"
                                    max="10"
                                    onChange={(e) => {
                                        const numPreguntas = Math.min(Math.max(parseInt(e.target.value), 1), 10); // Limitar a 10
                                        setFormData({
                                            ...formData,
                                            numPreguntas: numPreguntas,
                                            preguntas: new Array(numPreguntas).fill(''),
                                        });
                                    }}
                                    className="mt-2 block w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                />
                            </div>
                            {/* Renderizamos dinámicamente los campos de preguntas */}
                            {Array.from({ length: formData.numPreguntas }, (_, index) => (
                                <div key={index}>
                                    <label htmlFor={`pregunta_${index + 1}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Pregunta {index + 1}
                                    </label>
                                    <input
                                        type="text"
                                        id={`pregunta_${index + 1}`}
                                        name={`preguntas[${index}]`}
                                        value={formData.preguntas[index]}
                                        onChange={(e) => handlePreguntaChange(index, e)}
                                        className="mt-2 block w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                    />
                                </div>
                            ))}
                            <button
                                type="submit"
                                className="w-full bg-teal-600 text-white py-3 px-6 rounded-xl hover:bg-teal-700 transition duration-300 transform hover:scale-105"
                            >
                                Crear Encuesta
                            </button>
                        </form>

                        {/* Tabla de encuestas */}
                        <div className="overflow-x-auto w-full mt-8">
                            <table className="w-full border-collapse shadow-lg rounded-2xl overflow-hidden">
                                {/* Encabezado */}
                                <thead className="bg-gradient-to-r from-teal-500 to-blue-500 text-white">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">ID</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Título</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Descripción</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Acciones</th>
                                    </tr>
                                </thead>
                                {/* Cuerpo de la tabla */}
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {encuestas.map((encuesta, index) => (
                                        <tr key={encuesta.id} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-200 transition`}>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">{encuesta.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{encuesta.titulo}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{encuesta.descripcion}</td>
                                            <td className="px-6 py-4 flex space-x-2">
                                                <button
                                                    className="px-4 py-2 text-white bg-red-500 rounded-lg shadow-md hover:bg-red-600 transition duration-300 transform hover:scale-105"
                                                    onClick={() => handleDelete(encuesta.id)}
                                                >
                                                    Eliminar
                                                </button>
                                                <Link
                                                    href={`/encuestas/${encuesta.id}/editar`}
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

                        {/* Tabla de preguntas relacionadas con la encuesta */}
                        {encuestas.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-4xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Preguntas de la Encuesta</h3>
                                {encuestas.map((encuesta) => (
                                    <div key={encuesta.id}>
                                        <h4 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{encuesta.titulo}</h4>
                                        <div className="overflow-x-auto w-full mt-4">
                                            <table className="w-full border-collapse shadow-lg rounded-2xl overflow-hidden">
                                                <thead className="bg-gradient-to-r from-teal-500 to-blue-500 text-white">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">ID Pregunta</th>
                                                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">ID Encuesta</th>
                                                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Pregunta</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {encuesta.preguntas.map((pregunta) => (
                                                        <tr key={pregunta.id} className="hover:bg-gray-200 transition">
                                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">{pregunta.id}</td>
                                                            <td className="px-6 py-4 text-sm text-gray-900">{pregunta.encuesta_id}</td>
                                                            <td className="px-6 py-4 text-sm text-gray-900">{pregunta.pregunta}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}