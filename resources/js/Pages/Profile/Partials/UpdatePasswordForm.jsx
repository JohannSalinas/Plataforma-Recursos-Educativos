import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={`${className} bg-white bg-opacity-60 p-8 rounded-2xl shadow-lg`}>
            <header>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Actualizar Contraseña
                </h2>

                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Asegúrate de que tu cuenta esté utilizando una contraseña larga y aleatoria para mantenerla segura.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                {/* Campo de Contraseña Actual */}
                <div>
                    <InputLabel
                        htmlFor="current_password"
                        value="Contraseña Actual"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    />

                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        type="password"
                        className="mt-2 block w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                        autoComplete="current-password"
                    />

                    <InputError
                        message={errors.current_password}
                        className="mt-2 text-sm text-red-600"
                    />
                </div>

                {/* Campo de Nueva Contraseña */}
                <div>
                    <InputLabel
                        htmlFor="password"
                        value="Nueva Contraseña"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    />

                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="mt-2 block w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                        autoComplete="new-password"
                    />

                    <InputError
                        message={errors.password}
                        className="mt-2 text-sm text-red-600"
                    />
                </div>

                {/* Campo de Confirmación de Contraseña */}
                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmar Contraseña"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    />

                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        type="password"
                        className="mt-2 block w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                        autoComplete="new-password"
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2 text-sm text-red-600"
                    />
                </div>

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