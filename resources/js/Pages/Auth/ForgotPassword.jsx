import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Recuperar Contraseña" />

            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                ¿Olvidaste tu contraseña? No te preocupes. Solo ingresa tu
                dirección de correo electrónico y te enviaremos un enlace para
                restablecer tu contraseña y elegir una nueva.
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">
                    {status}
                </div>
            )}

            <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full mx-auto">
                <h2 className="text-2xl font-semibold text-center text-gray-800">Recupera tu contraseña</h2>
                <p className="text-center text-sm text-gray-600 mt-2">Ingresa tu correo para recibir el enlace de restablecimiento</p>

                <form onSubmit={submit} className="mt-6 space-y-4">
                    {/* Entrada de correo electrónico */}
                    <div>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />

                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    {/* Botón de envío */}
                    <div className="mt-6 flex justify-center">
                        <PrimaryButton className="w-full py-2 bg-indigo-600 text-white rounded-lg" disabled={processing}>
                            Enviar enlace de restablecimiento
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
