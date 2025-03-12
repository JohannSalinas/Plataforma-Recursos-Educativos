<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'user_type' => 'required|in:profesor,coordinador',
            'genero' => 'required|in:masculino,femenino,otro',
            'gradoAcademico' => 'required|in:licenciatura,maestria,doctorado',
            'fechaNacimiento' => 'required|date',
            'foto' => 'required|image|max:10240',  // Validación de la imagen
        ]);

        $fechaNacimiento = \Carbon\Carbon::parse($request->fechaNacimiento);
        if ($fechaNacimiento->diffInYears(\Carbon\Carbon::now()) < 18) {
            return redirect()->back()->withErrors(['fechaNacimiento' => 'Debes tener al menos 18 años.']);
        }

        // Handle the image upload
        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('fotos', 'public');
        }

        $user = User::create([
            'nombre' => $request->nombre,
            'apellidos' => $request->apellidos,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'user_type' => $request->user_type,
            'genero' => $request->genero,
            'gradoAcademico' => $request->gradoAcademico,
            'fechaNacimiento' => $request->fechaNacimiento,
            'foto' => $fotoPath,
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
