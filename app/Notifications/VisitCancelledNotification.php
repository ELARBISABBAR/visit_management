<?php

namespace App\Notifications;

use App\Mail\VisitCancelledMail;
use App\Models\Visit;
use Illuminate\Mail\Mailable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Schema;

class VisitCancelledNotification extends Notification
{
    public function __construct(
        public readonly Visit $visit,
    ) {
    }

    public function via(object $notifiable): array
    {
        $channels = [];
        $mailTo = $notifiable->routeNotificationFor('mail', $this);

        if (! empty($mailTo)) {
            $channels[] = 'mail';
        }

        if (Schema::hasTable('notifications')) {
            $channels[] = 'database';
        }

        return $channels;
    }

    public function toMail(object $notifiable): Mailable
    {
        return (new VisitCancelledMail($this->visit))
            ->to($notifiable->routeNotificationFor('mail', $this));
    }

    /**
     * @return array<string, mixed>
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'type' => 'visit_cancelled',
            'message' => 'Votre visite a été annulée.',
            'visitor_name' => $this->visit->visitor_name,
            'company' => $this->visit->company,
            'scheduled_at' => optional($this->visit->scheduled_at)?->toDateTimeString(),
        ];
    }
}

