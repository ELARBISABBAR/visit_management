<?php

namespace App\Notifications;

use App\Enums\VisitStatus;
use App\Mail\VisitCompletedMail;
use App\Models\Visit;
use Illuminate\Mail\Mailable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Schema;

class VisitCompletedNotification extends Notification
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
        return (new VisitCompletedMail($this->visit))
            ->to($notifiable->routeNotificationFor('mail', $this));
    }

    /**
     * @return array<string, mixed>
     */
    public function toDatabase(object $notifiable): array
    {
        $departureAt = $this->visit->status === VisitStatus::COMPLETED
            ? $this->visit->updated_at
            : null;
        $durationMinutes = $this->visit->arrival_at && $departureAt
            ? $this->visit->arrival_at->diffInMinutes($departureAt)
            : null;

        return [
            'type' => 'visit_completed',
            'message' => 'Votre visite est terminée.',
            'visitor_name' => $this->visit->visitor_name,
            'visitor_type' => $this->visit->visitor_type,
            'company' => $this->visit->company,
            'department' => $this->visit->department?->name,
            'scheduled_at' => optional($this->visit->scheduled_at)?->toDateTimeString(),
            'arrival_at' => optional($this->visit->arrival_at)?->toDateTimeString(),
            'departure_at' => optional($departureAt)?->toDateTimeString(),
            'duration_minutes' => $durationMinutes,
            'badge_color' => $this->visit->badge_color,
        ];
    }
}

