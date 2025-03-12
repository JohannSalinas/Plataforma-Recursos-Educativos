import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router, Link } from '@inertiajs/react';
import Swal from 'sweetalert2';
import { useState } from 'react';
import {route} from "ziggy-js";

export default function AdminUsuarios() {
    const { users } = usePage().props;
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        user_type: '',
        genero: '',
        apellidos: '',
        gradoAcademico: '',
        fechaNacimiento: '',
        foto: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'foto') {
            setFormData((prev) => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = new FormData();
        for (const key in formData) {
            if (formData[key] !== null && formData[key] !== '') {
                data.append(key, formData[key]);
            }
        }

        console.log([...data.entries()]); // Verifica los datos que se están enviando

        router.post(route('storeNewUser'), data, {
            onSuccess: () => {
                Swal.fire('Éxito', 'Usuario creado correctamente.', 'success');
                setFormData({
                    nombre: '',
                    email: '',
                    password: '',
                    user_type: '',
                    genero: '',
                    apellidos: '',
                    gradoAcademico: '',
                    fechaNacimiento: '',
                    foto: null,
                });
            },
            onError: (errors) => {
                console.log(errors); // Verifica los errores que se están recibiendo
                const errorMessage = errors.message || 'Hubo un problema al crear el usuario.';
                Swal.fire('Error', errorMessage, 'error');
            }
        });
    };

    const handleDelete = (userId) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Deseas eliminar al usuario con ID: ${userId}? Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/usuarios/${userId}`, {
                    onSuccess: () => {
                        Swal.fire('Eliminado', 'El usuario ha sido eliminado correctamente.', 'success');
                    },
                    onError: () => {
                        Swal.fire('Error', 'Hubo un problema al eliminar el usuario.', 'error');
                    },
                });
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Administrar Usuarios" />

            <div className="relative bg-gradient-to-r from-teal-400 to-blue-500 text-white min-h-screen flex flex-col items-center justify-center py-12">
                <div className="relative bg-white bg-opacity-60 text-gray-800 shadow-lg rounded-2xl p-8 max-w-7xl w-full space-y-6">
                    <h1 className="text-4xl font-extrabold mb-4 text-gray-800">Administrar Usuarios</h1>

                    {/* Formulario para crear un nuevo usuario */}
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-xl space-y-4 bg-opacity-30">
                        <h2 className="text-2xl font-bold text-gray-800">Crear Nuevo Usuario</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Apellidos</label>
                                <input
                                    type="text"
                                    name="apellidos"
                                    value={formData.apellidos}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
                                <input
                                    type="password"
                                    name="password_confirmation"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tipo de Usuario</label>
                                <select
                                    name="user_type"
                                    value={formData.user_type}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                    required
                                >
                                    <option value="">Seleccione un tipo</option>
                                    <option value="admin">Admin</option>
                                    <option value="coordinador">Coordinador</option>
                                    <option value="profesor">Profesor</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Género</label>
                                <select
                                    name="genero"
                                    value={formData.genero}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                    required
                                >
                                    <option value="">Seleccione un género</option>
                                    <option value="masculino">Masculino</option>
                                    <option value="femenino">Femenino</option>
                                    <option value="otro">Otro</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Grado Académico</label>
                                <select
                                    name="gradoAcademico"
                                    value={formData.gradoAcademico}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                    required
                                >
                                    <option value="">Seleccione un grado academico</option>
                                    <option value="licenciatura">Licenciatura</option>
                                    <option value="maestria">Maestria</option>
                                    <option value="doctorado">Doctorado</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                                <input
                                    type="date"
                                    name="fechaNacimiento"
                                    value={formData.fechaNacimiento}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Foto de Perfil</label>
                                <input
                                    type="file"
                                    name="foto"
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-bg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-teal-600 text-white py-3 px-6 rounded-xl hover:bg-teal-700 transition duration-300 transform hover:scale-105"
                        >
                            Crear Usuario
                        </button>
                    </form>

                    {/* Tabla de usuarios */}
                    <div className="overflow-x-auto w-full mt-8">
                        <table className="w-full border-collapse shadow-lg rounded-2xl overflow-hidden">
                            {/* Encabezado */}
                            <thead className="bg-gradient-to-r from-teal-500 to-blue-500 text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase">ID</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Nombre</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Apellidos</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Género</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Grado Académico</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Nacimiento</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Foto</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Tipo Usuario</th>
                                    <th className="px-6 py-3 text-center text-sm font-semibold uppercase">Acciones</th>
                                </tr>
                            </thead>

                            {/* Cuerpo de la tabla */}
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user, index) => (
                                    <tr key={user.id} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-200 transition`}>
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{user.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{user.nombre}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{user.apellidos}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{user.genero}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{user.gradoAcademico}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{user.fechaNacimiento}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {user.foto && <img src={`/storage/${user.foto}`} alt="Foto" className="w-10 h-10 rounded-full" />}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{user.user_type}</td>
                                        <td className="px-6 py-4 flex space-x-2 justify-center">
                                            <button
                                                className="px-4 py-2 text-white bg-red-500 rounded-lg shadow-md hover:bg-red-600 transition duration-300 transform hover:scale-105"
                                                onClick={() => handleDelete(user.id)}
                                            >
                                                Eliminar
                                            </button>
                                            <Link
                                                href={`/usuarios/${user.id}/editar`}
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
