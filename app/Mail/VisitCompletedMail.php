<?php

namespace App\Mail;

use App\Enums\VisitStatus;
use App\Models\Visit;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VisitCompletedMail extends Mailable
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
            subject: 'Votre visite est terminée',
        );
    }

    public function content(): Content
    {
        $departureAt = $this->visit->status === VisitStatus::COMPLETED
            ? $this->visit->updated_at
            : null;
        $durationMinutes = $this->visit->arrival_at && $departureAt
            ? $this->visit->arrival_at->diffInMinutes($departureAt)
            : null;

        return new Content(
            view: 'emails.visits.completed',
            with: [
                'visit' => $this->visit,
                'departureAt' => $departureAt,
                'durationMinutes' => $durationMinutes,
            ],
        );
    }
}

