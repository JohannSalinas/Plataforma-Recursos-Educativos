import { useEffect, useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const notificacionesActivas = user ? user.notificacionesActivas : 0;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutos en segundos
    const [showTimer, setShowTimer] = useState(true); // Para mostrar/ocultar el contador

    const inactivityTimerRef = useRef(null);
    const countdownTimerRef = useRef(null);

    useEffect(() => {
        const resetTimer = () => {
            clearTimeout(inactivityTimerRef.current);
            clearInterval(countdownTimerRef.current);
            setTimeLeft(5 * 60); // Reiniciar el contador
            setShowTimer(true); // Ocultar el contador

            inactivityTimerRef.current = setTimeout(startCountdown, .1 * 10 * 1000); // Mostrar contador tras 4 min
        };

        const startCountdown = () => {
            setShowTimer(true); // Mostrar el contador

            countdownTimerRef.current = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(countdownTimerRef.current);
                        logoutUser();
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        };

        const logoutUser = () => {
            router.post(route('logout'));
        };

        // Eventos de actividad
        const events = ['keydown', 'scroll', 'touchstart'];
        events.forEach((event) => {
            window.addEventListener(event, resetTimer);
        });

        // Iniciar el temporizador al montar el componente
        resetTimer();

        return () => {
            events.forEach((event) => {
                window.removeEventListener(event, resetTimer);
            });
            clearTimeout(inactivityTimerRef.current);
            clearInterval(countdownTimerRef.current);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 py-10 px-5">
            {/* Contador visual */}
            {showTimer && (
                <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
                    La sesión se cerrará en {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                </div>
            )}

            {/* Barra de navegación */}
            <nav className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Texto destacado */}
                    <div className="flex justify-center py-4">
                        <span className="text-2xl font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider font-sans">
                            PLATAFORMA PARA RECURSOS EDUCATIVOS ABIERTOS PARA DOCENTES
                        </span>
                    </div>

                    <div className="flex h-16 justify-between">
                        <div className="flex items-center">
                            {/* Botón de menú móvil */}
                            <div className="flex items-center sm:hidden">
                                <button
                                    onClick={() =>
                                        setShowingNavigationDropdown((previousState) => !previousState)
                                    }
                                    className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none dark:text-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-400 dark:focus:bg-gray-900 dark:focus:text-gray-400"
                                >
                                    <svg
                                        className="h-6 w-6"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                        <path
                                            className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {/* NavLinks para pantallas grandes */}
                            <div className="hidden space-x-4 sm:-my-px sm:ml-10 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                    className="px-4 py-2 text-sm font-semibold transition duration-300 ease-in-out transform hover:scale-105 rounded-lg"
                                    //activeClassName="bg-green-600 text-white shadow-lg"
                                    //inactiveClassName="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-100"
                                >
                                    Dashboard
                                </NavLink>
                                {user.user_type === 'admin' && (
                                    <>
                                        <NavLink
                                            href={route('usuarios.index')}
                                            active={route().current('usuarios.index')}
                                            className="px-4 py-2 text-sm font-semibold transition duration-300 ease-in-out transform hover:scale-105 rounded-lg"
                                            //activeClassName="bg-green-600 text-white shadow-lg"
                                            //inactiveClassName="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-100"
                                        >
                                            Gestión Usuarios
                                        </NavLink>
                                        <NavLink
                                            href={route('recursos.index')}
                                            active={route().current('recursos.index')}
                                            className="px-4 py-2 text-sm font-semibold transition duration-300 ease-in-out transform hover:scale-105 rounded-lg"
                                            //activeClassName="bg-green-600 text-white shadow-lg"
                                            //inactiveClassName="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-100"
                                        >
                                            Gestión Recursos Educativos
                                        </NavLink>
                                        <NavLink
                                            href={route('noticias.index')}
                                            active={route().current('noticias.index')}
                                            className="px-4 py-2 text-sm font-semibold transition duration-300 ease-in-out transform hover:scale-105 rounded-lg"
                                            //activeClassName="bg-green-600 text-white shadow-lg"
                                            //inactiveClassName="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-100"
                                        >
                                            Gestión Noticias
                                        </NavLink>
                                        <NavLink
                                            href={route('encuestas.index')}
                                            active={route().current('encuestas.index')}
                                            className="px-4 py-2 text-sm font-semibold transition duration-300 ease-in-out transform hover:scale-105 rounded-lg"
                                            //activeClassName="bg-green-600 text-white shadow-lg"
                                            //inactiveClassName="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-100"
                                        >
                                            Gestión Encuestas
                                        </NavLink>
                                        <NavLink
                                            href={route('grupos-colaboradores.index')}
                                            active={route().current('grupos-colaboradores.index')}
                                            className="px-4 py-2 text-sm font-semibold transition duration-300 ease-in-out transform hover:scale-105 rounded-lg"
                                            //activeClassName="bg-green-600 text-white shadow-lg"
                                            //inactiveClassName="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-100"
                                        >
                                            Gestión Grupos de Colaboradores
                                        </NavLink>
                                        <NavLink
                                            href={route('grupo-usuarios.index')}
                                            active={route().current('grupo-usuarios.index')}
                                            className="px-4 py-2 text-sm font-semibold transition duration-300 ease-in-out transform hover:scale-105 rounded-lg"
                                            //activeClassName="bg-green-600 text-white shadow-lg"
                                            //inactiveClassName="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-100"
                                        >
                                            Grupo Usuarios
                                        </NavLink>
                                        <NavLink
                                            href={route('backup-restore.index')}
                                            active={route().current('backup-restore.index')}
                                            className="px-4 py-2 text-sm font-semibold transition duration-300 ease-in-out transform hover:scale-105 rounded-lg"
                                            //activeClassName="bg-green-600 text-white shadow-lg"
                                            //inactiveClassName="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-100"
                                        >
                                            Respaldo y Restauración BD
                                        </NavLink>
                                        <NavLink
                                            href={route('preguntas.index')}
                                            active={route().current('preguntas.index')}
                                            className="px-4 py-2 text-sm font-semibold transition duration-300 ease-in-out transform hover:scale-105 rounded-lg"
                                            //activeClassName="bg-green-600 text-white shadow-lg"
                                            //inactiveClassName="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-100"
                                        >
                                            Foro de Preguntas
                                        </NavLink>
                                        <NavLink
                                            href={route('reportes.index')}
                                            active={route().current('reportes.index')}
                                            className="px-4 py-2 text-sm font-semibold transition duration-300 ease-in-out transform hover:scale-105 rounded-lg"
                                            //activeClassName="bg-green-600 text-white shadow-lg"
                                            //inactiveClassName="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-100"
                                        >
                                            Generar Reportes
                                        </NavLink>
                                    </>
                                )}

                                {user.user_type === 'profesor' && (
                                    <>
                                        <NavLink
                                            href={route('grupos-colaboradores.profesor')}
                                            active={route().current('grupos-colaboradores.profesor')}
                                            className="px-4 py-2 text-sm font-semibold transition duration-300 ease-in-out transform hover:scale-105 rounded-lg"
                                            //activeClassName="bg-green-600 text-white shadow-lg"
                                            //inactiveClassName="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-100"
                                        >
                                            Grupos de Colaboradores
                                        </NavLink>
                                        <NavLink
                                            href={route('recursos.profesor')}
                                            active={route().current('recursos.profesor')}
                                            className="px-4 py-2 text-sm font-semibold transition duration-300 ease-in-out transform hover:scale-105 rounded-lg"
                                            //activeClassName="bg-green-600 text-white shadow-lg"
                                            //inactiveClassName="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-100"
                                        >
                                            Ver Recursos Educativos
                                        </NavLink>
                                        <NavLink
                                            href={route('noticias.profesor')}
                                            active={route().current('noticias.profesor')}
                                            className="px-4 py-2 text-sm font-semibold transition duration-300 ease-in-out transform hover:scale-105 rounded-lg"
                                            //activeClassName="bg-green-600 text-white shadow-lg"
                                            //inactiveClassName="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-100"
                                        >
                                            Lista de Noticias
                                        </NavLink>
                                        <NavLink
                                            href={route('preguntas.index')}
                                            active={route().current('preguntas.index')}
                                            className="px-4 py-2 text-sm font-semibold transition duration-300 ease-in-out transform hover:scale-105 rounded-lg"
                                            //activeClassName="bg-green-600 text-white shadow-lg"
                                            //inactiveClassName="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-100"
                                        >
                                            Foro de Preguntas
                                        </NavLink>
                                        <NavLink
                                            href={route('encuestas.profesor')}
                                            active={route().current('encuestas.profesor')}
                                            className="px-4 py-2 text-sm font-semibold transition duration-300 ease-in-out transform hover:scale-105 rounded-lg"
                                            //activeClassName="bg-green-600 text-white shadow-lg"
                                            //inactiveClassName="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-100"
                                        >
                                            Lista de Encuestas
                                        </NavLink>
                                        <NavLink
                                            href={route('recursos.index')}
                                            active={route().current('recursos.index')}
                                            className="px-4 py-2 text-sm font-semibold transition duration-300 ease-in-out transform hover:scale-105 rounded-lg"
                                            //activeClassName="bg-green-600 text-white shadow-lg"
                                            //inactiveClassName="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-100"
                                        >
                                            Gestión Recursos Educativos
                                        </NavLink>
                                        <NavLink
                                            href={route('profesor.mis-calificados')} // Nueva ruta para "Mis Calificados"
                                            active={route().current('profesor.mis-calificados')} // Activar si la ruta coincide
                                            className="px-4 py-2 text-sm font-semibold transition duration-300 ease-in-out transform hover:scale-105 rounded-lg"
                                            //activeClassName="bg-green-600 text-white shadow-lg" // Esto ya no es necesario en versiones recientes de Inertia
                                            //inactiveClassName="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-100"
                                        >
                                            Mis calificados
                                        </NavLink>
                                    </>
                                )}

                                {user.user_type === 'coordinador' && (
                                    <>
                                        <NavLink
                                            href={route('grupos-colaboradores.profesor')}
                                            active={route().current('grupos-colaboradores.profesor')}
                                            className="px-4 py-2 text-sm font-semibold transition duration-300 ease-in-out transform hover:scale-105 rounded-lg"
                                            //activeClassName="bg-green-600 text-white shadow-lg"
                                            //inactiveClassName="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-100"
                                        >
                                            Grupos de Colaboradores
                                        </NavLink>
                                        <NavLink
                                            href={route('recursos.profesor')}
                                            active={route().current('recursos.profesor')}
                                            className="px-4 py-2 text-sm font-semibold transition duration-300 ease-in-out transform hover:scale-105 rounded-lg"
                                            //activeClassName="bg-green-600 text-white shadow-lg"
                                            //inactiveClassName="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-100"
                                        >
                                            Ver Recursos Educativos
                                        </NavLink>
                                        <NavLink
                                            href={route('noticias.profesor')}
                                            active={route().current('noticias.profesor')}
                                            className="px-4 py-2 text-sm font-semibold transition duration-300 ease-in-out transform hover:scale-105 rounded-lg"
                                            //activeClassName="bg-green-600 text-white shadow-lg"
                                            //inactiveClassName="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-100"
                                        >
                                            Lista de Noticias
                                        </NavLink>
                                        <NavLink
                                            href={route('preguntas.index')}
                                            active={route().current('preguntas.index')}
                                            className="px-4 py-2 text-sm font-semibold transition duration-300 ease-in-out transform hover:scale-105 rounded-lg"
                                            //activeClassName="bg-green-600 text-white shadow-lg"
                                            //inactiveClassName="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-100"
                                        >
                                            Foro de Preguntas
                                        </NavLink>
                                        <NavLink
                                            href={route('encuestas.profesor')}
                                            active={route().current('encuestas.profesor')}
                                            className="px-4 py-2 text-sm font-semibold transition duration-300 ease-in-out transform hover:scale-105 rounded-lg"
                                            //activeClassName="bg-green-600 text-white shadow-lg"
                                            //inactiveClassName="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-100"
                                        >
                                            Lista de Encuestas
                                        </NavLink>
                                        <NavLink
                                            href={route('recursos.index')}
                                            active={route().current('recursos.index')}
                                            className="px-4 py-2 text-sm font-semibold transition duration-300 ease-in-out transform hover:scale-105 rounded-lg"
                                            //activeClassName="bg-green-600 text-white shadow-lg"
                                            //inactiveClassName="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-100"
                                        >
                                            Gestión Recursos Educativos
                                        </NavLink>
                                        <NavLink
                                            href={route('profesor.mis-calificados')} // Nueva ruta para "Mis Calificados"
                                            active={route().current('profesor.mis-calificados')} // Activar si la ruta coincide
                                            className="px-4 py-2 text-sm font-semibold transition duration-300 ease-in-out transform hover:scale-105 rounded-lg"
                                            //activeClassName="bg-green-600 text-white shadow-lg" // Esto ya no es necesario en versiones recientes de Inertia
                                            //inactiveClassName="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-100"
                                        >
                                            Mis calificados
                                        </NavLink>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Menú de usuario */}
                        <div className="hidden sm:ml-6 sm:flex sm:items-center">
                            <div className="relative ml-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 transition duration-150 ease-in-out hover:text-blue-600 focus:outline-none dark:bg-gray-800 dark:text-gray-300 dark:hover:text-blue-400"
                                            >
                                                {user.name}
                                                <svg
                                                    className="-mr-0.5 ml-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>
                                            Perfil
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('notifications.show')}>
                                            Notificaciones
                                            {notificacionesActivas > 0 && (
                                                <span className="ml-2 inline-flex items-center justify-center h-4 w-4 bg-red-500 text-white text-xs rounded-full">
                                                    {notificacionesActivas}
                                                </span>
                                            )}
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Cerrar Sesión
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Menú móvil desplegable */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                        {user.user_type === 'admin' && (
                            <>
                                <ResponsiveNavLink
                                    href={route('usuarios.index')}
                                    active={route().current('usuarios.index')}
                                >
                                    Admin Usuarios
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('recursos.index')}
                                    active={route().current('recursos.index')}
                                >
                                    Gestion Recursos Educativos
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('noticias.index')}
                                    active={route().current('noticias.index')}
                                >
                                    Gestion Noticias
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('encuestas.index')}
                                    active={route().current('encuestas.index')}
                                >
                                    Gestion Encuestas
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('grupos-colaboradores.index')}
                                    active={route().current('grupos-colaboradores.index')}
                                >
                                    Gestión Grupos de Colaboradores
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('grupo-usuarios.index')}
                                    active={route().current('grupo-usuarios.index')}
                                >
                                    Grupo Usuarios
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('backup-restore.index')}
                                    active={route().current('backup-restore.index')}
                                >
                                    Respaldo y Restauración BD
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('preguntas.index')}
                                    active={route().current('preguntas.index')}
                                >
                                    Foro de Preguntas
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('reportes.index')}
                                    active={route().current('reportes.index')}
                                >
                                    Generar Reportes
                                </ResponsiveNavLink>
                            </>
                        )}

                        {user.user_type === 'profesor' && (
                            <>
                                <ResponsiveNavLink
                                    href={route('grupos-colaboradores.profesor')}
                                    active={route().current('grupos-colaboradores.profesor')}
                                >
                                    Grupos de Colaboradores
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('recursos.profesor')}
                                    active={route().current('recursos.profesor')}
                                >
                                    Ver Recursos Educativos
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('noticias.profesor')}
                                    active={route().current('noticias.profesor')}
                                >
                                    Lista de Noticias
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('preguntas.index')}
                                    active={route().current('preguntas.index')}
                                >
                                    Foro de Preguntas
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('encuestas.profesor')}
                                    active={route().current('encuestas.profesor')}
                                >
                                    Lista de Encuestas
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('profesor.mis-calificados')} // Nueva ruta para "Mis Calificados"
                                    active={route().current('profesor.mis-calificados')} // Activar si la ruta coincide
                                >
                                    Mis Calificados
                                </ResponsiveNavLink>
                            </>
                        )}

                        {user.user_type === 'coordinador' && (
                            <>
                                <ResponsiveNavLink
                                    href={route('grupos-colaboradores.profesor')}
                                    active={route().current('grupos-colaboradores.profesor')}
                                >
                                    Grupos de Colaboradores
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('recursos.profesor')}
                                    active={route().current('recursos.profesor')}
                                >
                                    Ver Recursos Educativos
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('noticias.profesor')}
                                    active={route().current('noticias.profesor')}
                                >
                                    Lista de Noticias
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('preguntas.index')}
                                    active={route().current('preguntas.index')}
                                >
                                    Foro de Preguntas
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('encuestas.profesor')}
                                    active={route().current('encuestas.profesor')}
                                >
                                    Lista de Encuestas
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('profesor.mis-calificados')} // Nueva ruta para "Mis Calificados"
                                    active={route().current('profesor.mis-calificados')} // Activar si la ruta coincide
                                >
                                    Mis Calificados
                                </ResponsiveNavLink>
                            </>
                        )}
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4 dark:border-gray-600">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Perfil
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route('notifications.show')}>
                                Notificaciones
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Cerrar Sesión
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Encabezado */}
            {header && (
                <header className="bg-white shadow dark:bg-gray-800 rounded-lg mt-6">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Contenido principal */}
            <main className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                {children}
            </main>
        </div>
    );
}
