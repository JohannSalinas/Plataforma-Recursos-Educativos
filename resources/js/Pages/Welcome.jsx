import { Head, Link } from '@inertiajs/react';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Bienvenido" />
            <div className="relative bg-gradient-to-r from-teal-400 to-blue-500 text-white min-h-screen flex flex-col items-center justify-center">

                {/* Texto destacado más arriba con diseño mejorado */}
                <div className="absolute top-10 text-center px-4">
                    <div className="bg-white/20 backdrop-blur-lg p-8 md:p-10 rounded-2xl border border-white/40 shadow-2xl inline-block">
                        <h1 className="text-5xl md:text-6xl font-extrabold uppercase font-sans tracking-wide drop-shadow-lg">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-800 to-blue-900 animate-text-glow">
                                PLATAFORMA PARA RECURSOS EDUCATIVOS ABIERTOS PARA DOCENTES
                            </span>
                        </h1>
                    </div>
                </div>

                {/* Contenedor principal */}
                <div className="relative bg-white bg-opacity-60 text-gray-800 shadow-lg rounded-2xl p-8 max-w-lg w-full text-center space-y-6 mt-24">
                    <h1 className="text-4xl font-extrabold mb-4 text-gray-800">
                        ¡Bienvenido a la Plataforma Educativa!
                    </h1>
                    <p className="text-lg text-gray-700 mb-6">
                        Explora y accede a una variedad de recursos educativos abiertos diseñados para mejorar la enseñanza.
                    </p>

                    {/* Opciones de navegación */}
                    <nav className="flex flex-col space-y-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded-xl transition duration-300 transform hover:scale-105"
                            >
                                <span className="mr-2">Ir al Dashboard</span>
                                <FaSignInAlt />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-xl transition duration-300 transform hover:scale-105"
                                >
                                    <span className="mr-2">Iniciar Sesión</span>
                                    <FaSignInAlt />
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl transition duration-300 transform hover:scale-105"
                                >
                                    <span className="mr-2">Registrarse</span>
                                    <FaUserPlus />
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </>
    );
}
