import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function EditarEncuesta({ encuesta }) {
    const { data, setData, put, errors } = useForm({
        titulo: encuesta.titulo,
        descripcion: encuesta.descripcion || '',
        preguntas: encuesta.preguntas.map((pregunta) => pregunta.pregunta), // Solo los textos de las preguntas
    });

    const handlePreguntaChange = (index, e) => {
        const updatedPreguntas = [...data.preguntas];
        updatedPreguntas[index] = e.target.value;
        setData('preguntas', updatedPreguntas);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/encuestas/${encuesta.id}`, {
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: '¡Encuesta actualizada!',
                    text: 'La encuesta se ha actualizado correctamente.',
                    confirmButtonColor: '#4CAF50'
                });
            },
            onError: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un problema al actualizar la encuesta.',
                    confirmButtonColor: '#F44336'
                });
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Editar Encuesta
                </h2>
            }
        >
            <Head title="Editar Encuesta" />

            <div className="min-h-screen bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="relative bg-white bg-opacity-60 text-gray-800 shadow-lg rounded-2xl p-8 max-w-7xl w-full space-y-6">
                        <h3 className="text-4xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            Editar Encuesta
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
                                    value={data.titulo}
                                    onChange={(e) => setData('titulo', e.target.value)}
                                    className="mt-2 block w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                />
                                {errors.titulo && <span className="text-red-500 text-sm mt-2">{errors.titulo}</span>}
                            </div>
                            <div>
                                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Descripción
                                </label>
                                <textarea
                                    id="descripcion"
                                    name="descripcion"
                                    value={data.descripcion}
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                    className="mt-2 block w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                ></textarea>
                                {errors.descripcion && <span className="text-red-500 text-sm mt-2">{errors.descripcion}</span>}
                            </div>

                            {/* Número de preguntas (no editable) */}
                            <div>
                                <label htmlFor="numPreguntas" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Número de Preguntas (no editable)
                                </label>
                                <input
                                    type="number"
                                    id="numPreguntas"
                                    name="numPreguntas"
                                    value={encuesta.preguntas.length}
                                    disabled
                                    className="mt-2 block w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 bg-gray-100"
                                />
                            </div>

                            {/* Renderizamos las preguntas y permitimos su edición */}
                            {data.preguntas.map((pregunta, index) => (
                                <div key={index}>
                                    <label htmlFor={`pregunta_${index + 1}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Pregunta {index + 1}
                                    </label>
                                    <input
                                        type="text"
                                        id={`pregunta_${index + 1}`}
                                        name={`preguntas[${index}]`}
                                        value={pregunta}
                                        onChange={(e) => handlePreguntaChange(index, e)}
                                        className="mt-2 block w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                    />
                                    {errors.preguntas && errors.preguntas[index] && (
                                        <span className="text-red-500 text-sm mt-2">{errors.preguntas[index]}</span>
                                    )}
                                </div>
                            ))}

                            <button
                                type="submit"
                                className="w-full bg-teal-600 text-white py-3 px-6 rounded-xl hover:bg-teal-700 transition duration-300 transform hover:scale-105"
                            >
                                Actualizar Encuesta
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}