<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Validation\Rules;

class UserController extends Controller
{
     // Método para almacenar un nuevo usuario
    public function storeNewUser(Request $request)
    {   
         // Validación de los datos del formulario
        $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'user_type' => 'required|in:admin,profesor,coordinador',
            'genero' => 'required|in:masculino,femenino,otro',
            'apellidos' => 'required|string|max:255',
            'gradoAcademico' => 'required|in:licenciatura,maestria,doctorado',
            'fechaNacimiento' => 'required|date',
            'foto' => 'required|image|max:10240',
        ]);

        // Verificación de que el usuario tenga al menos 18 años
        $fechaNacimiento = \Carbon\Carbon::parse($request->fechaNacimiento);
        if ($fechaNacimiento->diffInYears(\Carbon\Carbon::now()) < 18) {
            return redirect()->back()->withErrors(['fechaNacimiento' => 'Debes tener al menos 18 años.']);
        }

         // Manejo de la subida de la imagen
        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('fotos', 'public'); // Almacena la imagen en la carpeta 'fotos' del disco público
        }

        // Creación del nuevo usuario en la base de datos
        $user = User::create([
            'nombre' => $request->nombre,
            'apellidos' => $request->apellidos,
            'email' => $request->email,
            'password' => Hash::make($request->password),// Hash de la contraseña
            'user_type' => $request->user_type,
            'genero' => $request->genero,
            'gradoAcademico' => $request->gradoAcademico,
            'fechaNacimiento' => $request->fechaNacimiento,
            'foto' => $fotoPath,
        ]);

        // Redirección a la lista de usuarios después de crear el nuevo usuario
        return redirect(route('usuarios.index'));
    }

    // Método para mostrar el formulario de edición de un usuario
    public function edit($id)
    {
        $user = User::findOrFail($id); // Busca el usuario por ID o falla si no lo encuentra
        return Inertia::render('EditarUsuario', [
            'user' => $user // Pasa el usuario a la vista de edición
        ]);
    }

    // Método para actualizar un usuario existente
    public function update(Request $request, $id)
    {
    // Validación de los datos del formulario
    $request->validate([
        'nombre' => 'required|string|max:255',
        'email' => 'required|email|max:255|unique:users,email,' . $id,
        'user_type' => 'required|string',
        'password' => 'nullable|string|min:8|confirmed',  // Validación de la contraseña
        'apellidos' => 'required|string|max:255',
        'genero' => 'required|in:masculino,femenino,otro',
        'gradoAcademico' => 'required|in:licenciatura,maestria,doctorado',
        'fechaNacimiento' => 'required|date',
        'foto' => 'nullable|image|max:10240'
    ]);

    // Verificación de que el usuario tenga al menos 18 años
    $fechaNacimiento = \Carbon\Carbon::parse($request->fechaNacimiento);
        if ($fechaNacimiento->diffInYears(\Carbon\Carbon::now()) < 18) {
            return redirect()->back()->withErrors(['fechaNacimiento' => 'Debes tener al menos 18 años.']);
        }

    $user = User::findOrFail($id);

    // Si la contraseña fue proporcionada, la actualizamos
    if ($request->filled('password')) {
        $user->password = bcrypt($request->password);
    }

    // Manejo de la subida de la nueva imagen
    if ($request->hasFile('foto')) {
        $this->deleteFile($user->foto);   // Elimina la imagen anterior
        $user->foto = $request->file('foto')->store('fotos', 'public');
    }

    // Actualización de los datos del usuario
    $user->update($request->only([
        'nombre',
        'apellidos',
        'email',
        'user_type',
        'genero',
        'gradoAcademico',
        'fechaNacimiento',
        'foto' => $user->foto
    ]));

        // Redirección a la lista de usuarios después de actualizar el usuario
        return redirect()->route('usuarios.index');
    }

    // Método para eliminar un usuario
    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id); // Busca el usuario por ID o falla si no lo encuentra
            $user->delete(); // Elimina el usuario

        } catch (\Exception $e) {

        }
    }

    // Método privado para eliminar un archivo del almacenamiento
    private function deleteFile($filePath)
    {
        if ($filePath && Storage::disk('public')->exists($filePath)) {
            Storage::disk('public')->delete($filePath); // Elimina el archivo si existe
        }
    }
}
