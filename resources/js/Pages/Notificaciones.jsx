import { useEffect, useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { route } from "ziggy-js";
import Swal from 'sweetalert2';

export default function Notificaciones() {
    const { notificaciones } = usePage().props;
    const auth = usePage().props.auth.user;
    const [filteredNotificaciones, setFilteredNotificaciones] = useState([]);

    useEffect(() => {
        if (auth.id) {
            const visibleNotificaciones = notificaciones.filter(notif => notif.visible === 1);

            if (auth.id === notificaciones[0]?.id_usuario_creador_grupo) {
                setFilteredNotificaciones(visibleNotificaciones.filter(notif => notif.estatus === 'pendiente'));
            } else {
                setFilteredNotificaciones(visibleNotificaciones.filter(notif => notif.estatus !== 'pendiente'));
            }
        }
    }, [auth, notificaciones]);

    const handleUpdateStatus = (notificacionId, newStatus, isVisible) => {
        Swal.fire({
            title: `¿Seguro que deseas ${newStatus === 'aceptado' ? 'aceptar' : 'rechazar'} esta solicitud?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: newStatus === 'aceptado' ? "#3085d6" : "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Sí, confirmar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                router.put(route('notifications.update', notificacionId), {
                    estatus: newStatus,
                    visible: isVisible,
                }, {
                    onSuccess: () => {
                        setFilteredNotificaciones((prev) =>
                            prev.map(notif =>
                                notif.id === notificacionId ? { ...notif, estatus: newStatus, visible: isVisible } : notif
                            ).filter(notif => notif.visible === 1)
                        );

                        Swal.fire({
                            title: "¡Actualizado!",
                            text: `La notificación ha sido ${newStatus}.`,
                            icon: "success",
                            timer: 2000,
                            showConfirmButton: false
                        });
                    },
                    onError: (error) => {
                        console.error('Error al actualizar la notificación:', error);
                        Swal.fire("Error", "Hubo un problema al actualizar la notificación.", "error");
                    }
                });
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-blue-600 p-6">
                <div className="w-full max-w-6xl bg-white/20 backdrop-blur-md rounded-xl p-8 shadow-lg">
                    <h1 className="text-3xl font-bold text-white text-center mb-6">📩 Notificaciones</h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredNotificaciones.length > 0 ? (
                            filteredNotificaciones.map((notificacion) => (
                                <div key={notificacion.id} className="bg-white/30 backdrop-blur-lg p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
                                    <h2 className="text-xl font-semibold text-gray-900">{`Grupo: ${notificacion.grupo.nombre}`}</h2>
                                    <p className="text-gray-700 mt-2">{`Solicitante: ${notificacion.usuario_solicitante.nombre}`}</p>
                                    <p className="text-gray-800 font-semibold mt-2">{`Estatus: ${notificacion.estatus}`}</p>

                                    {notificacion.estatus === 'pendiente' ? (
                                        <div className="mt-4 flex gap-2">
                                            <button
                                                className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded-md transition-all"
                                                onClick={() => handleUpdateStatus(notificacion.id, 'aceptado', true)}
                                            >
                                                ✅ Aceptar
                                            </button>
                                            <button
                                                className="w-full bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition-all"
                                                onClick={() => handleUpdateStatus(notificacion.id, 'rechazado', true)}
                                            >
                                                ❌ Rechazar
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="mt-4">
                                            <button
                                                className="w-full bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-md transition-all"
                                                onClick={() => handleUpdateStatus(notificacion.id, notificacion.estatus, false)}
                                            >
                                                🛑 Deshabilitar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-200 text-center w-full">No tienes notificaciones.</p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
