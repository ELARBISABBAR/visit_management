<?php

namespace App\Notifications;

use App\Mail\VisitArrivedMail;
use App\Models\Visit;
use Illuminate\Mail\Mailable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Schema;

class VisitorArrivedNotification extends Notification
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
        return (new VisitArrivedMail($this->visit))
            ->to($notifiable->routeNotificationFor('mail', $this));
    }

    /**
     * @return array<string, mixed>
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'type' => 'visitor_arrived',
            'message' => "Votre visiteur est arrivé à l'accueil.",
            'visitor_name' => $this->visit->visitor_name,
            'visitor_type' => $this->visit->visitor_type,
            'company' => $this->visit->company,
            'arrival_time' => optional($this->visit->arrival_at)?->toDateTimeString(),
            'visit_time' => optional($this->visit->scheduled_at)?->toDateTimeString(),
            'department' => $this->visit->department?->name,
            'badge_color' => $this->visit->badge_color,
        ];
    }
}

