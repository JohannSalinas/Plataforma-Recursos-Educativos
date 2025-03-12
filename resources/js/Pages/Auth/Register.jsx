import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: '',
        apellidos: '',
        email: '',
        password: '',
        password_confirmation: '',
        user_type: 'profesor', // Valor predeterminado
        genero: 'otro', // Valor predeterminado
        gradoAcademico: 'licenciatura', // Valor predeterminado
        fechaNacimiento: '',
        foto: null,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setData(name, files[0]);
        } else {
            setData(name, value);
        }
    };

    return (
        <GuestLayout>
            <Head title="Registro" />

            <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full mx-auto">
                <h2 className="text-2xl font-semibold text-center text-gray-800">Crea tu cuenta</h2>
                <p className="text-center text-sm text-gray-600 mt-2">Completa los siguientes campos para registrarte</p>

                <form onSubmit={submit} className="mt-6 space-y-4">
                    {/* Nombre */}
                    <div>
                        <InputLabel htmlFor="nombre" value="Nombre" />
                        <TextInput
                            id="nombre"
                            name="nombre"
                            value={data.nombre}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            autoComplete="nombre"
                            isFocused={true}
                            onChange={handleInputChange}
                            required
                        />
                        <InputError message={errors.nombre} className="mt-2" />
                    </div>

                    {/* Apellidos */}
                    <div className="mt-4">
                        <InputLabel htmlFor="apellidos" value="Apellidos" />
                        <TextInput
                            id="apellidos"
                            name="apellidos"
                            value={data.apellidos}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            autoComplete="apellidos"
                            onChange={handleInputChange}
                            required
                        />
                        <InputError message={errors.apellidos} className="mt-2" />
                    </div>

                    {/* Email */}
                    <div className="mt-4">
                        <InputLabel htmlFor="email" value="Correo Electrónico" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            autoComplete="username"
                            onChange={handleInputChange}
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    {/* Contraseña */}
                    <div className="mt-4">
                        <InputLabel htmlFor="password" value="Contraseña" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            autoComplete="new-password"
                            onChange={handleInputChange}
                            required
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    {/* Confirmar Contraseña */}
                    <div className="mt-4">
                        <InputLabel htmlFor="password_confirmation" value="Confirmar Contraseña" />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            autoComplete="new-password"
                            onChange={handleInputChange}
                            required
                        />
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>

                    {/* Tipo de Usuario */}
                    <div className="mt-4">
                        <InputLabel htmlFor="user_type" value="Tipo de Usuario" />
                        <select
                            id="user_type"
                            name="user_type"
                            value={data.user_type}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            onChange={handleInputChange}
                            required
                        >
                            <option value="profesor">Profesor</option>
                            <option value="coordinador">Coordinador</option>
                        </select>
                        <InputError message={errors.user_type} className="mt-2" />
                    </div>

                    {/* Género */}
                    <div className="mt-4">
                        <InputLabel htmlFor="genero" value="Género" />
                        <select
                            id="genero"
                            name="genero"
                            value={data.genero}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            onChange={handleInputChange}
                            required
                        >
                            <option value="masculino">Masculino</option>
                            <option value="femenino">Femenino</option>
                            <option value="otro">Otro</option>
                        </select>
                        <InputError message={errors.genero} className="mt-2" />
                    </div>

                    {/* Grado Académico */}
                    <div className="mt-4">
                        <InputLabel htmlFor="gradoAcademico" value="Grado Académico" />
                        <select
                            id="gradoAcademico"
                            name="gradoAcademico"
                            value={data.gradoAcademico}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            onChange={handleInputChange}
                            required
                        >
                            <option value="licenciatura">Licenciatura</option>
                            <option value="maestria">Maestría</option>
                            <option value="doctorado">Doctorado</option>
                        </select>
                        <InputError message={errors.gradoAcademico} className="mt-2" />
                    </div>

                    {/* Fecha de Nacimiento */}
                    <div className="mt-4">
                        <InputLabel htmlFor="fechaNacimiento" value="Fecha de Nacimiento" />
                        <TextInput
                            id="fechaNacimiento"
                            type="date"
                            name="fechaNacimiento"
                            value={data.fechaNacimiento}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            autoComplete="bday"
                            onChange={handleInputChange}
                            required
                        />
                        <InputError message={errors.fechaNacimiento} className="mt-2" />
                    </div>

                    {/* Foto */}
                    <div className="mt-4">
                        <InputLabel htmlFor="foto" value="Foto" />
                        <input
                            id="foto"
                            type="file"
                            name="foto"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            onChange={handleInputChange}
                        />
                        <InputError message={errors.foto} className="mt-2" />
                    </div>

                    {/* Enlace de inicio de sesión y botón de registro */}
                    <div className="mt-4 flex items-center justify-between">
                        <Link
                            href={route('login')}
                            className="text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                        >
                            ¿Ya tienes cuenta?
                        </Link>

                        <PrimaryButton className="ml-4 w-full py-2 bg-indigo-600 text-white rounded-lg" disabled={processing}>
                            Registrar
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
