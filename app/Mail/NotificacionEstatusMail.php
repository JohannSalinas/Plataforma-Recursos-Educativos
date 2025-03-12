<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NotificacionEstatusMail extends Mailable
{
    use Queueable, SerializesModels;

    public $estatus;
    public $grupoNombre;

    public $nombre;

    /**
     * Create a new message instance.
     *
     * @param string $estatus
     * @param string $grupoNombre
     */
    public function __construct($estatus, $grupoNombre, $nombre)
    {
        $this->estatus = $estatus;
        $this->grupoNombre = $grupoNombre;
        $this->nombre = $nombre;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Actualización de estatus de solicitud')
            ->view('email.notificacion_estatus'); // Vista del correo
    }
}
