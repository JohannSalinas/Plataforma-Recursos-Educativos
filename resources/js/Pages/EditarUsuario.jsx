import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import Swal from "sweetalert2"; // Importar SweetAlert2

export default function EditarUsuario({ user }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: user.nombre,
        apellidos: user.apellidos,
        email: user.email,
        password: "",
        password_confirmation: "",
        user_type: user.user_type,
        genero: user.genero,
        gradoAcademico: user.gradoAcademico,
        fechaNacimiento: user.fechaNacimiento,
        foto: null,
        _method: "PUT",
    });

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            setData(name, files[0]);
        } else {
            setData(name, value);
        }
    };

    const submit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("_method", "PUT");

        Object.keys(data).forEach((key) => {
            if (key === "foto" && data[key]) {
                formData.append(key, data[key]);
            } else if (key !== "foto" && data[key] !== null) {
                formData.append(key, data[key]);
            }
        });

        post(route("usuarios.update", user.id), formData, {
            forceFormData: true,
            preserveState: true,
            onSuccess: () => {
                Swal.fire({
                    title: "¡Éxito!",
                    text: "El usuario ha sido actualizado correctamente.",
                    icon: "success",
                    confirmButtonColor: "#2563eb",
                });
                reset("password", "password_confirmation");
            },
            onError: () => {
                Swal.fire({
                    title: "Error",
                    text: "Hubo un problema al actualizar el usuario. Revisa los campos e intenta nuevamente.",
                    icon: "error",
                    confirmButtonColor: "#dc2626",
                });
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Editar Usuario" />
            <div className="bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 min-h-screen py-10 px-5 flex justify-center items-center">
                <div className="w-full max-w-4xl bg-white bg-opacity-50 backdrop-blur-md p-8 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
                        Editar Usuario
                    </h2>

                    <form onSubmit={submit} encType="multipart/form-data">
                        <input type="hidden" name="_method" value="PUT" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="nombre" value="Nombre" />
                                <TextInput
                                    id="nombre"
                                    name="nombre"
                                    value={data.nombre}
                                    className="mt-1 block w-full"
                                    autoComplete="nombre"
                                    onChange={handleInputChange}
                                    required
                                />
                                <InputError message={errors.nombre} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="apellidos" value="Apellidos" />
                                <TextInput
                                    id="apellidos"
                                    name="apellidos"
                                    value={data.apellidos}
                                    className="mt-1 block w-full"
                                    autoComplete="apellidos"
                                    onChange={handleInputChange}
                                />
                                <InputError message={errors.apellidos} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    autoComplete="username"
                                    onChange={handleInputChange}
                                    required
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="user_type" value="Tipo de Usuario" />
                                <select
                                    id="user_type"
                                    name="user_type"
                                    value={data.user_type}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="admin">Administrador</option>
                                    <option value="profesor">Profesor</option>
                                    <option value="coordinador">Coordinador</option>
                                </select>
                                <InputError message={errors.user_type} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value="Nueva Contraseña" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full"
                                    autoComplete="new-password"
                                    onChange={handleInputChange}
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password_confirmation" value="Confirmar Contraseña" />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-1 block w-full"
                                    autoComplete="new-password"
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="genero" value="Género" />
                                <select
                                    id="genero"
                                    name="genero"
                                    value={data.genero}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="masculino">Masculino</option>
                                    <option value="femenino">Femenino</option>
                                    <option value="otro">Otro</option>
                                </select>
                                <InputError message={errors.genero} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="gradoAcademico" value="Grado Académico" />
                                <select
                                    id="gradoAcademico"
                                    name="gradoAcademico"
                                    value={data.gradoAcademico}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="licenciatura">Licenciatura</option>
                                    <option value="maestria">Maestría</option>
                                    <option value="doctorado">Doctorado</option>
                                </select>
                                <InputError message={errors.gradoAcademico} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="fechaNacimiento" value="Fecha de Nacimiento" />
                                <TextInput
                                    id="fechaNacimiento"
                                    type="date"
                                    name="fechaNacimiento"
                                    value={data.fechaNacimiento}
                                    className="mt-1 block w-full"
                                    onChange={handleInputChange}
                                />
                                <InputError message={errors.fechaNacimiento} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="foto" value="Foto de Perfil" />
                                <input
                                    id="foto"
                                    type="file"
                                    name="foto"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    onChange={handleInputChange}
                                    accept="image/*"
                                />
                                <InputError message={errors.foto} className="mt-2" />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center">
                            <PrimaryButton className="justify-center w-full bg-teal-600 text-white py-3 px-6 rounded-xl hover:bg-teal-700 transition duration-300 transform hover:scale-105" disabled={processing}>
                                Actualizar Usuario
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}