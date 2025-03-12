import { Swiper, SwiperSlide } from "swiper/react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'; // Importa ArcElement
import 'swiper/css';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FaStar } from 'react-icons/fa'; // Agregar iconos

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement); // Registra ArcElement

export default function Dashboard({ recursosNuevos, recursosMejorCalificados, gruposMasGrandes, gruposMasRecursos, usuariosPorGradoAcademico }) {
    // Datos para el gráfico de barras
    const barData = {
        labels: gruposMasRecursos.map(grupo => grupo.nombre), // Nombres de los grupos
        datasets: [
            {
                label: 'Recursos',
                data: gruposMasRecursos.map(grupo => grupo.recursos_count), // Cantidad de recursos
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Datos para el gráfico de pastel (distribución de usuarios por grado académico)
    const pieData = {
        labels: usuariosPorGradoAcademico.map(usuario => usuario.gradoAcademico), // Grados académicos
        datasets: [
            {
                data: usuariosPorGradoAcademico.map(usuario => usuario.total), // Cantidad de usuarios
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 205, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <AuthenticatedLayout
            
        >
            <Head title="Dashboard" />

            <div className="py-12 min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Sección de Contenido */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">

                        {/* Tarjeta de Recursos Más Nuevos */}
                        <div className="bg-white shadow-xl rounded-lg p-6 hover:shadow-2xl transition-all">
                            <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
                                <FaStar className="mr-2 text-yellow-500" />
                                Recursos Más Nuevos
                            </h3>
                            <ul className="space-y-4">
                                {recursosNuevos.map((recurso) => (
                                    <li key={recurso.id} className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all">
                                        <span className="font-semibold">{recurso.titulo}</span> - {new Date(recurso.created_at).toLocaleDateString()}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Gráfico de Barras (Ocupa 2 espacios) */}
                        <div className="lg:col-span-2 bg-white shadow-xl rounded-lg p-6 hover:shadow-2xl transition-all">
                            <h3 className="text-lg font-bold mb-4 text-gray-800">Grupos con más Recursos</h3>
                            <div className="h-72">
                                <Bar data={barData} options={{ responsive: true }} />
                            </div>
                        </div>

                        {/* Gráfico de Pastel */}
                        <div className="bg-white shadow-xl rounded-lg p-6 hover:shadow-2xl transition-all">
                            <h3 className="text-lg font-bold mb-4 text-gray-800">Distribución de Usuarios por Grado Académico</h3>
                            <div className="h-72">
                                <Pie data={pieData} options={{ responsive: true }} />
                            </div>
                        </div>

                        {/* Tarjeta de Recursos Mejor Calificados (Ocupa 2 espacios) */}
                        <div className="lg:col-span-2 bg-white shadow-xl rounded-lg p-6 hover:shadow-2xl transition-all">
                            <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
                                <FaStar className="mr-2 text-yellow-500" />
                                Recursos Mejor Calificados
                            </h3>
                            <ul className="space-y-4">
                                {recursosMejorCalificados.map((recurso) => (
                                    <li key={recurso.id} className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all">
                                        <span className="font-semibold">{recurso.titulo}</span> - ⭐ {recurso.calificacion}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Carrusel de Grupos con Más Miembros */}
                        <div className="col-span-1 lg:col-span-2 xl:col-span-3 bg-white shadow-xl rounded-lg p-6 hover:shadow-2xl transition-all">
                            <h3 className="text-lg font-bold mb-4 text-gray-800">Grupos con Más Miembros</h3>
                            <div className="swiper-container">
                                <Swiper
                                    spaceBetween={30}
                                    slidesPerView={3}
                                    autoplay={{
                                        delay: 3000,
                                        disableOnInteraction: false,
                                    }}
                                    loop={true}
                                >
                                    {gruposMasGrandes.map((grupo) => (
                                        <SwiperSlide key={grupo.id}>
                                            <div className="bg-gray-200 shadow-xl rounded-lg p-6 hover:scale-105 transition-all">
                                                <h4 className="text-lg font-semibold">{grupo.nombre}</h4>
                                                <p>{grupo.usuarios_count} miembros</p>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}