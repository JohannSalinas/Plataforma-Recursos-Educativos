import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';

export default function GruposUsuario() {
    const { gruposColaboradores = [] } = usePage().props;

    return (
        <AuthenticatedLayout
            
        >
            <Head title="Grupos de Usuarios" />

            <div className="min-h-screen bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {Array.isArray(gruposColaboradores) && gruposColaboradores.length > 0 ? (
                        gruposColaboradores.map((grupo) => (
                            <div key={grupo.id} className="relative bg-white bg-opacity-60 text-gray-800 shadow-lg rounded-2xl p-8 max-w-7xl w-full space-y-6 mb-6">
                                <h3 className="text-4xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Usuarios en el Grupo: {grupo.nombre}</h3>
                                <div className="overflow-x-auto w-full">
                                    <table className="w-full border-collapse shadow-lg rounded-2xl overflow-hidden">
                                        <thead className="bg-gradient-to-r from-teal-500 to-blue-500 text-white">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-sm font-semibold uppercase">ID</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Nombre</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Email</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {grupo.usuarios && grupo.usuarios.length > 0 ? (
                                                grupo.usuarios.map((usuario) => (
                                                    <tr key={usuario.id} className="hover:bg-gray-200 transition">
                                                        <td className="px-6 py-4 text-sm text-gray-900">{usuario.id}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-900">{usuario.nombre}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-900">{usuario.email}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="3" className="border px-4 py-2 text-center text-gray-500">No hay usuarios en este grupo.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                <p className="text-center text-gray-500">No hay grupos para mostrar.</p>
                            </div>
                        </div>
                    )}

                    <div className="mt-4 text-center">
                        <Link
                            href="/grupos-colaboradores"
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 transform hover:scale-105"
                        >
                            Regresar a los Grupos
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
