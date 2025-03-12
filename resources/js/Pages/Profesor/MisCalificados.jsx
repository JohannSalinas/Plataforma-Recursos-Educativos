import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';

export default function MisCalificados() {
    const { recursosCalificados } = usePage().props; // Obtenemos los recursos calificados desde las props pasadas por Inertia

    return (
        <AuthenticatedLayout>
            <Head title="Mis Calificados" />

            <div className="relative bg-gradient-to-r from-teal-400 to-blue-500 text-white min-h-screen flex flex-col items-center justify-center py-12">
                

                {/* Contenedor principal */}
                <div className="relative bg-white bg-opacity-60 text-gray-800 shadow-lg rounded-2xl p-8 max-w-7xl w-full space-y-6">
                    <h1 className="text-4xl font-extrabold mb-4 text-gray-800">
                        Mis Recursos Calificados
                    </h1>

                    {recursosCalificados.length > 0 ? (
                        <div className="overflow-x-auto w-full mt-8">
                            <table className="w-full border-collapse shadow-lg rounded-2xl overflow-hidden">
                                {/* Encabezado */}
                                <thead className="bg-gradient-to-r from-teal-500 to-blue-500 text-white">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Título</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Descripción</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Tu Calificación</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Calificación Promedio</th>
                                    </tr>
                                </thead>

                                {/* Cuerpo de la tabla */}
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recursosCalificados.map((recurso, index) => {
                                        const calificacionUsuario = recurso.calificaciones[0]?.calificacion || 0;
                                        const calificacionPromedio = Number(recurso.calificacion) || 0;

                                        return (
                                            <tr
                                                key={recurso.id}
                                                className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-gray-200 transition`}
                                            >
                                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{recurso.titulo}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{recurso.descripcion}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    <div className="flex items-center">
                                                        {[...Array(5)].map((_, index) => {
                                                            const rating = calificacionUsuario;
                                                            return (
                                                                <span
                                                                    key={index}
                                                                    className={`${
                                                                        rating >= index + 1 ? 'text-yellow-500' : 'text-gray-300'
                                                                    } text-2xl`}
                                                                >
                                                                    ★
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    <div className="flex items-center">
                                                        {[...Array(5)].map((_, index) => {
                                                            const ratingPromedio = calificacionPromedio;
                                                            return (
                                                                <span
                                                                    key={index}
                                                                    className={`${
                                                                        ratingPromedio >= index + 1 ? 'text-yellow-500' : 'text-gray-300'
                                                                    } text-2xl`}
                                                                >
                                                                    ★
                                                                </span>
                                                            );
                                                        })}
                                                        <span className="ml-2 text-gray-800">({calificacionPromedio.toFixed(1)})</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-200 text-center w-full">No has calificado ningún recurso.</p>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}