<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Biometric extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'recorded_at',
        'type',
        'value',
        'unit',
        'metadata',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'recorded_at' => 'date',
            'metadata' => 'array',
            'value' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
