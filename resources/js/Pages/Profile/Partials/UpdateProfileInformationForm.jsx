import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function UpdateProfileInformation({
                                                     mustVerifyEmail,
                                                     status,
                                                     className = '',
                                                 }) {
    const user = usePage().props.user;
    // En useForm, cambia 'fotos' a 'foto'
    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            nombre: user.nombre,
            email: user.email,
            apellidos: user.apellidos,
            foto: null, // Inicializa como null
        });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'foto') {
            setData(name, files[0]); // Usa setData para actualizar el estado
        } else {
            setData(name, value); // Usa setData para actualizar el estado
        }
    };

    // Actualiza el método submit para usar POST
    const submit = (e) => {
        e.preventDefault();
        console.log("Datos a enviar:", data); // Debug para ver los valores

        const formData = new FormData();
        formData.append('nombre', data.nombre);
        formData.append('apellidos', data.apellidos);
        formData.append('email', data.email);

        if (data.foto) {
            formData.append('foto', data.foto);
            console.log("Foto adjunta: ", data.foto.name); // Debug para la foto
        }

        console.log(...formData);

        // Cambia patch por post
        post(route('profile.update'), formData, {
            forceFormData: true, // Fuerza el uso de FormData
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: '¡Perfil actualizado!',
                    text: 'La información de tu perfil se ha actualizado correctamente.',
                    confirmButtonColor: '#4CAF50',
                });
            },
            onError: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un problema al actualizar tu perfil.',
                    confirmButtonColor: '#F44336',
                });
            },
        });
    };

    return (
        <section className={`${className} bg-white bg-opacity-60 p-8 rounded-2xl shadow-lg`}>
            <header>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Información del Perfil
                </h2>

                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Actualiza la información de tu perfil y dirección de correo electrónico.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6" encType="multipart/form-data">
                {/* Campo de Nombre */}
                <div>
                    <InputLabel htmlFor="nombre" value="Nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300" />

                    <TextInput
                        id="nombre"
                        className="mt-2 block w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                        value={data.nombre}
                        onChange={handleChange} // Usa handleChange aquí
                        required
                        isFocused
                        autoComplete="nombre"
                        name="nombre" // Asegúrate de agregar el atributo name
                    />

                    <InputError className="mt-2 text-sm text-red-600" message={errors.nombre} />
                </div>

                {/* Campo de Apellido */}
                <div>
                    <InputLabel htmlFor="apellido" value="Apellidos" className="block text-sm font-medium text-gray-700 dark:text-gray-300" />

                    <TextInput
                        id="apellidos"
                        className="mt-2 block w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                        value={data.apellidos}
                        onChange={handleChange} // Usa handleChange aquí
                        required
                        autoComplete="apellidos"
                        name="apellidos" // Asegúrate de agregar el atributo name
                    />

                    <InputError className="mt-2 text-sm text-red-600" message={errors.apellidos} />
                </div>

                {/* Campo de Email */}
                <div>
                    <InputLabel htmlFor="email" value="Correo Electrónico" className="block text-sm font-medium text-gray-700 dark:text-gray-300" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-2 block w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                        value={data.email}
                        onChange={handleChange} // Usa handleChange aquí
                        required
                        autoComplete="username"
                        name="email" // Asegúrate de agregar el atributo name
                    />

                    <InputError className="mt-2 text-sm text-red-600" message={errors.email} />
                </div>

                {/* Campo Foto de Perfil */}
                <div>
                    <InputLabel htmlFor="foto" value="Foto de Perfil" className="block text-sm font-medium text-gray-700 dark:text-gray-300" />

                    {/* Mostrar la foto de perfil actual */}
                    {user.foto && (
                        <div className="mt-2">
                            <img
                                src={`/storage/${user.foto}`}
                                alt="Foto de perfil"
                                className="w-20 h-20 rounded-full object-cover"
                            />
                        </div>
                    )}

                    {/* Cambia el nombre del campo a 'foto' */}
                    <input
                        id="foto"
                        name="foto"
                        type="file"
                        className="mt-2 block w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                        onChange={handleChange}
                        accept="image/*"
                    />

                    <InputError className="mt-2 text-sm text-red-600" message={errors.foto} />
                </div>

                {/* Verificación de Email */}
                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                            Tu dirección de correo electrónico no está verificada.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="ml-1 text-sm text-yellow-700 underline hover:text-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 dark:text-yellow-300 dark:hover:text-yellow-400"
                            >
                                Haz clic aquí para reenviar el correo de verificación.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                Se ha enviado un nuevo enlace de verificación a tu correo electrónico.
                            </div>
                        )}
                    </div>
                )}

                {/* Botón de Guardar y Mensaje de Éxito */}
                <div className="flex items-center gap-4">
                    <PrimaryButton
                        disabled={processing}
                        className="w-full bg-teal-600 text-white py-3 px-6 rounded-xl hover:bg-teal-700 transition duration-300 transform hover:scale-105"
                    >
                        Guardar
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-green-600 dark:text-green-400">
                            Guardado.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
