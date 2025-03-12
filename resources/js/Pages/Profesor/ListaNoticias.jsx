import { useEffect } from "react";
import { usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"; // Asegúrate de importar tu layout

export default function ListaNoticias() {
    const { noticias } = usePage().props;

    useEffect(() => {
        if (noticias.length === 0) {
            Swal.fire({
                title: "Sin noticias",
                text: "Aún no hay noticias disponibles.",
                icon: "info",
                confirmButtonColor: "#4F46E5",
            });
        }
    }, [noticias]);

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-gradient-to-br from-blue-500 to-green-500 p-6">
                <h1 className="text-3xl font-bold text-white text-center mb-6">📢 Noticias</h1>

                {noticias.length === 0 ? (
                    <div className="text-center text-white text-lg">No hay noticias disponibles en este momento.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {noticias.map((noticia) => (
                            <div
                                key={noticia.id}
                                className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-transform hover:scale-105 hover:shadow-2xl"
                            >
                                {noticia.imagen && (
                                    <img
                                        src={`/storage/${noticia.imagen}`}
                                        alt={noticia.titulo}
                                        className="w-full h-80 object-cover rounded-t-xl"
                                    />
                                )}
                                <div className="p-6 bg-gradient-to-r from-blue-50 via-green-50 to-blue-100">
                                    <h2 className="text-2xl font-semibold text-gray-800 hover:text-indigo-600 transition-colors">
                                        {noticia.titulo}
                                    </h2>
                                    <p className="text-gray-700 text-base mt-2">{noticia.descripcion}</p>
                                    <p className="text-sm text-gray-500 mt-4 flex items-center">
                                        <span className="mr-2">📍</span>
                                        {noticia.lugar} |{" "}
                                        <span className="ml-2">📅 {new Date(noticia.fecha_evento).toLocaleDateString()}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
