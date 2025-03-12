import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/inertia-react';
import FileViewer from 'react-file-viewer';
import Swal from 'sweetalert2';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';

const ListaRecursos = ({ grupos, auth }) => {
    const [calificaciones, setCalificaciones] = useState({});
    const [calificacionesPromedio, setCalificacionesPromedio] = useState({});

    // Obtener las calificaciones del usuario al cargar la vista
    useEffect(() => {
        const fetchCalificaciones = async () => {
            try {
                const response = await axios.get(route('recursos.calificacionesUsuario'));
                setCalificaciones(response.data);

                // Inicializar las calificaciones promedio con los valores del servidor
                const promediosIniciales = {};
                grupos.forEach((grupo) => {
                    grupo.recursos.forEach((recurso) => {
                        promediosIniciales[recurso.id] = Number(recurso.calificacion) || 0;
                    });
                });
                setCalificacionesPromedio(promediosIniciales);
            } catch (error) {
                console.error('Error al obtener las calificaciones:', error);
            }
        };

        fetchCalificaciones();
    }, []);

    const handleCalificar = async (recursoId, nuevaCalificacion) => {
        try {
            // Enviar la calificación al servidor
            const response = await axios.post(route('recursos.calificar', recursoId), {
                calificacion: nuevaCalificacion,
            });

            // Actualizar la calificación del usuario en el estado local
            setCalificaciones((prev) => ({
                ...prev,
                [recursoId]: nuevaCalificacion,
            }));

            // Actualizar la calificación promedio en el estado local
            const nuevaCalificacionPromedio = Number(response.data.calificacion_promedio) || 0;
            setCalificacionesPromedio((prev) => ({
                ...prev,
                [recursoId]: nuevaCalificacionPromedio,
            }));

            // Mostrar una alerta de éxito
            Swal.fire({
                icon: 'success',
                title: '¡Calificación enviada!',
                text: 'Tu calificación ha sido registrada correctamente.',
                confirmButtonColor: '#2563eb',
            });
        } catch (error) {
            console.error('Error al calificar el recurso:', error);

            // Mostrar una alerta de error
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al calificar el recurso. Inténtalo de nuevo.',
                confirmButtonColor: '#dc2626',
            });
        }
    };

    const getFileDocs = (recurso) => {
        if (!recurso || !recurso.archivo_path) return null;
        return `/storage/${recurso.archivo_path}`;
    };

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-gradient-to-br from-green-500 to-blue-600 py-10 px-6">
                <div className="max-w-5xl mx-auto bg-white/30 backdrop-blur-md p-8 rounded-xl shadow-lg">
                    <h1 className="text-3xl font-bold text-white text-center mb-6">Recursos Educativos de Mis Grupos</h1>

                    {grupos.length > 0 ? (
                        grupos.map((grupo) => (
                            <div key={grupo.id} className="bg-white/40 backdrop-blur-lg p-6 rounded-lg shadow-md mb-6 transition-transform transform hover:scale-105">
                                <h2 className="text-xl font-semibold text-gray-900">{grupo.nombre}</h2>
                                <p className="text-gray-700 mt-2">{grupo.descripcion}</p>

                                {grupo.recursos.length > 0 ? (
                                    <ul className="mt-4 space-y-6">
                                        {grupo.recursos.map((recurso) => {
                                            // Obtener la calificación promedio del estado local
                                            const calificacionPromedio = Number(calificacionesPromedio[recurso.id]) || 0;
                                            const calificacionFormateada = calificacionPromedio.toFixed(1);

                                            return (
                                                <li key={recurso.id} className="p-6 bg-white/50 backdrop-blur-md rounded-lg shadow-md border border-gray-200 transition-all hover:shadow-lg">
                                                    <div className="mb-4">
                                                        <span className="font-semibold text-lg text-gray-800">{recurso.titulo}</span>
                                                    </div>

                                                    <p className="text-gray-600 mb-4">{recurso.descripcion}</p>

                                                    {/* Vista previa del archivo con react-file-viewer */}
                                                    {recurso.archivo_path && (
                                                        <div className="h-96 overflow-auto border rounded-lg shadow-md">
                                                            <FileViewer
                                                                fileType={recurso.archivo_path.split('.').pop()}
                                                                filePath={getFileDocs(recurso)}
                                                                onError={(e) => console.error('Error al cargar el archivo:', e)}
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Calificación del usuario */}
                                                    <div className="flex items-center mt-4">
                                                        <span className="font-semibold text-gray-800">Tu calificación: </span>
                                                        <div className="ml-3 flex items-center">
                                                            {[...Array(5)].map((_, index) => {
                                                                const rating = calificaciones[recurso.id] ?? 0;
                                                                return (
                                                                    <button
                                                                        key={index}
                                                                        onClick={() => handleCalificar(recurso.id, index + 1)}
                                                                        className={`${
                                                                            rating >= index + 1 ? 'text-yellow-500' : 'text-gray-300'
                                                                        } text-2xl hover:text-yellow-400 transition-all`}
                                                                    >
                                                                        ★
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>

                                                    {/* Calificación promedio del recurso */}
                                                    <div className="flex items-center mt-2">
                                                        <span className="font-semibold text-gray-800">Calificación promedio: </span>
                                                        <div className="ml-3 flex items-center">
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
                                                            <span className="ml-2 text-gray-800">({calificacionFormateada})</span>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 mt-2">No hay recursos en este grupo.</p>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-200 text-center w-full">No estás inscrito en ningún grupo.</p>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ListaRecursos;