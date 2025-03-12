import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gradient-to-r from-blue-500 via-teal-500 to-purple-500 pt-6 sm:justify-center sm:pt-0">
            <div>
                
            </div>
                {/* Texto destacado */}
                <div className="text-center mb-8 px-4">
                    <div className="bg-white/20 backdrop-blur-lg p-8 md:p-10 rounded-2xl border border-white/40 shadow-2xl">
                        <h1 className="text-4xl md:text-5xl font-extrabold uppercase font-sans tracking-wide drop-shadow-lg">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-800 to-blue-900 animate-text-glow">
                                PLATAFORMA PARA RECURSOS EDUCATIVOS ABIERTOS PARA DOCENTES
                            </span>
                        </h1>
                    </div>
                </div>


            <div className="mt-6 w-full max-w-md overflow-hidden bg-white px-6 py-4 shadow-lg sm:rounded-xl dark:bg-gray-800">
                {children}
            </div>
        </div>
    );
}