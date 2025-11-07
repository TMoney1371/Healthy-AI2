<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Exercise extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'date',
        'type',
        'duration',
        'calories',
        'distance',
        'heart_rate_avg',
        'source',
        'apple_watch_data',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'apple_watch_data' => 'array',
            'distance' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
