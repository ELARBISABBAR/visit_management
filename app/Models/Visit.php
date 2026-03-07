<?php

namespace App\Models;

use App\Enums\VisitStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Visit extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'demandeur_id',
        'visitor_name',
        'is_event',
        'event_name',
        'event_visitors',
        'visitor_type',
        'company',
        'department_id',
        'scheduled_at',
        'reason',
        'status',
        'arrival_at',
        'badge_color',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'scheduled_at' => 'datetime',
            'arrival_at' => 'datetime',
            'status' => VisitStatus::class,
            'is_event' => 'boolean',
            'event_visitors' => 'array',
        ];
    }

    public function demandeur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'demandeur_id');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }
}

