import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { route } from "ziggy-js";
import Swal from 'sweetalert2';

export default function ListaGrupos({ grupos }) {
    const user = usePage().props.auth.user;

    const handleUnirse = (grupoId, creadorId) => {
        Swal.fire({
            title: "¿Quieres unirte a este grupo?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, unirme",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('notifications.store'), {
                    grupo_id: grupoId,
                    creador_id: creadorId,
                    usuario_id: user.id
                }, {
                    onSuccess: () => {
                        Swal.fire({
                            title: "¡Solicitud enviada!",
                            text: "Espera Respuesta del Creador del Grupo.",
                            icon: "success",
                            timer: 2000,
                            showConfirmButton: false
                        });
                    },
                    onError: (error) => {
                        console.error("Error al unirse:", error);
                        Swal.fire("Error", "Hubo un problema al intentar unirte.", "error");
                    }
                });
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-blue-600 p-6">
                <div className="w-full max-w-6xl bg-white/20 backdrop-blur-md rounded-xl p-8 shadow-lg">
                    <h1 className="text-3xl font-bold text-white text-center mb-6">Grupos de Colaboradores</h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {grupos.length > 0 ? (
                            grupos.map((grupo) => (
                                <div key={grupo.id} className="bg-white/30 backdrop-blur-lg p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
                                    <h2 className="text-xl font-semibold text-gray-900">{grupo.nombre}</h2>
                                    <p className="text-gray-700 mt-2">{grupo.tipo}</p>
                                    <p className="text-gray-600 mt-2">{grupo.descripcion}</p>
                                    <p className="text-gray-600 mt-2"><strong>Temas:</strong> {grupo.temas_abordados}</p>
                                    <div className="mt-4">
                                        <button
                                            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-all"
                                            onClick={() => handleUnirse(grupo.id, grupo.creador_id)}
                                        >
                                            Unirse
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-200 text-center w-full">No hay grupos disponibles.</p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
