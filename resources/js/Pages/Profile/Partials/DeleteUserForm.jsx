import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className} bg-white bg-opacity-60 p-8 rounded-2xl shadow-lg`}>
            <header>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Eliminar Cuenta
                </h2>

                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Una vez que elimines tu cuenta, todos sus recursos y datos se eliminarán permanentemente. Antes de eliminar tu cuenta, descarga cualquier dato o información que desees conservar.
                </p>
            </header>

            <DangerButton
                onClick={confirmUserDeletion}
                className="w-full bg-red-600 text-white py-3 px-6 rounded-xl hover:bg-red-700 transition duration-300 transform hover:scale-105"
            >
                Eliminar Cuenta
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        ¿Estás seguro de que deseas eliminar tu cuenta?
                    </h2>

                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Una vez que elimines tu cuenta, todos sus recursos y datos se eliminarán permanentemente. Por favor, ingresa tu contraseña para confirmar que deseas eliminar tu cuenta de forma permanente.
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value="Contraseña"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="mt-2 block w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                            isFocused
                            placeholder="Contraseña"
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2 text-sm text-red-600"
                        />
                    </div>

                    <div className="mt-6 flex justify-end space-x-4">
                        <SecondaryButton
                            onClick={closeModal}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-xl hover:bg-gray-300 transition duration-300 transform hover:scale-105"
                        >
                            Cancelar
                        </SecondaryButton>

                        <DangerButton
                            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition duration-300 transform hover:scale-105"
                            disabled={processing}
                        >
                            Eliminar Cuenta
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}