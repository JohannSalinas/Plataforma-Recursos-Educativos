<?php

namespace App\Http\Controllers;

use App\Models\Noticia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;


class NoticiasController extends Controller
{
    // Mostrar todas las noticias (en la vista de gestión)
    public function index()
    {
        $noticias = Noticia::all(); // Puedes aplicar paginación si es necesario
        return inertia('GestionNoticias', ['noticias' => $noticias]);
    }

    // Mostrar el formulario para crear una nueva noticia
    public function create()
    {
        return inertia('CrearNoticia'); // Crea una vista para crear una noticia si lo necesitas
    }

    // Almacenar una nueva noticia
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'lugar' => 'required|string|max:255',
            'fecha_evento' => 'required|date',
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg,gif',
        ]);

        // Si se sube una imagen, guardarla en el almacenamiento
        if ($request->hasFile('imagen')) {
            $validatedData['imagen'] = $request->file('imagen')->store('noticias', 'public');
        }

        // Crear la noticia en la base de datos
        Noticia::create($validatedData);

        // Redirigir o responder con un mensaje de éxito
        return redirect(route('noticias.index'))->with('success', 'Noticia creada exitosamente.');
    }

    public function edit($id)
    {
        $noticia = Noticia::findOrFail($id);
        return Inertia::render('EditarNoticia', ['noticia' => $noticia]);
    }

    // Actualizar una noticia
    public function update(Request $request, $id)
    {
        // Validación de datos con la fecha que no puede ser anterior a la fecha actual
        $validatedData = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'lugar' => 'required|string|max:255',
            'fecha_evento' => 'required|date|after_or_equal:today', // Validación para la fecha
            'imagen' => 'nullable', // Permitir tanto archivos como paths
        ]);


        // Buscar la noticia por ID
        $noticia = Noticia::findOrFail($id);

        // Si se sube una nueva imagen, eliminar la antigua y guardarla
        if ($request->hasFile('imagen')) {
            // Eliminar la imagen anterior
            if ($noticia->imagen) {
                Storage::disk('public')->delete($noticia->imagen);
            }
            $validatedData['imagen'] = $request->file('imagen')->store('noticias', 'public');
        }

        // Actualizar los datos de la noticia
        $noticia->update($validatedData);

        // Redirigir o responder con un mensaje de éxito
        return redirect(route('noticias.index'))->with('success', 'Noticia actualizada exitosamente.');
    }


    // Eliminar una noticia
    public function destroy($id)
    {
        $noticia = Noticia::findOrFail($id);

        // Eliminar la imagen si existe
        if ($noticia->imagen) {
            Storage::disk('public')->delete($noticia->imagen);
        }

        // Eliminar la noticia
        $noticia->delete();

        // Redirigir con un mensaje de éxito
        return redirect(route('noticias.index'))->with('success', 'Noticia eliminada exitosamente.');
    }

    public function obtenerNoticias()
{
    $noticias = Noticia::orderBy('fecha_creacion', 'desc')->get();
    return inertia('Profesor/ListaNoticias', [
        'noticias' => $noticias
    ]);
}

}
