<?php

namespace App\Mail;

use App\Models\Visit;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VisitArrivedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Visit $visit,
    ) {
        $this->visit->loadMissing('department');
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Votre visiteur est arrivé',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.visits.arrived',
            with: [
                'visit' => $this->visit,
            ],
        );
    }
}

