<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SolicitudUnirseGrupo extends Notification
{
    public $grupo;
    public $usuarioSolicitante;

    public function __construct($grupo, $usuarioSolicitante)
    {
        $this->grupo = $grupo;
        $this->usuarioSolicitante = $usuarioSolicitante;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'message' => $this->usuarioSolicitante->name . ' quiere unirse a tu grupo: ' . $this->grupo->nombre,
            'grupo_id' => $this->grupo->id,
            'solicitante_id' => $this->usuarioSolicitante->id,
        ];
    }
}