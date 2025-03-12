import { useState } from "react";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Swal from 'sweetalert2'; // Importar SweetAlert2

const Reportes = () => {
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");

    const generarReporte = (tipo) => {
        // Validar que se hayan seleccionado ambas fechas
        if (!fechaInicio || !fechaFin) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Selecciona un rango de fechas.',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        // Validar que la fecha de inicio sea menor que la fecha de fin
        if (fechaInicio > fechaFin) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La fecha de inicio debe ser menor que la fecha de fin.',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        // Determinar la ruta según el tipo de reporte
        let routeName;
        switch (tipo) {
            case "top":
                routeName = "reportes.top";
                break;
            case "categoria":
                routeName = "reportes.categoria";
                break;
            case "solicitudes":
                routeName = "reportes.solicitudes";
                break;
            case "indicadores":
                routeName = "reportes.indicadores";
                break;
            default:
                routeName = "reportes.solicitudes";
        }

        // Abrir el reporte en una nueva pestaña
        const url = route(routeName, { fecha_inicio: fechaInicio, fecha_fin: fechaFin });
        window.open(url, "_blank");

        // Mostrar mensaje de éxito
        Swal.fire({
            icon: 'success',
            title: `Reporte ${tipo === "top" 
                ? "Top 5 Mejor Calificados" 
                : tipo === "categoria" 
                ? "Recursos por Categoría" 
                : tipo === "indicadores"
                ? "Indicadores de la Encuesta Aplicada"
                : "Solicitudes por Usuario"} generado con éxito.`,
            showConfirmButton: false,
            timer: 1500
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Generar Reportes" />
            <div className="bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 min-h-screen py-10 px-5">
                <div className="container mx-auto p-8 bg-white bg-opacity-50 rounded-lg shadow-md">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Generar Reportes en PDF</h2>

                    <div className="mb-4">
                        <label className="block text-lg text-gray-600 font-medium mb-2">Fecha de inicio:</label>
                        <input
                            type="date"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-lg text-gray-600 font-medium mb-2">Fecha de fin:</label>
                        <input
                            type="date"
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <button
                            onClick={() => generarReporte("top")}
                            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            📊 Generar Top 5 Mejor Calificados
                        </button>
                        <button
                            onClick={() => generarReporte("categoria")}
                            className="w-full md:w-auto px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            📑 Generar Recursos por Categoría
                        </button>

                        <button
                            onClick={() => generarReporte("solicitudes")}
                            className="w-full md:w-auto px-6 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                        >
                            📑 Generar Solicitudes por Usuario
                        </button>

                        {/* Nuevo botón para generar indicadores de la encuesta */}
                        <button
                            onClick={() => generarReporte("indicadores")}
                            className="w-full md:w-auto px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                        >
                            📈 Generar Indicadores de la Encuesta Aplicada
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Reportes;