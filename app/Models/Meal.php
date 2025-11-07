<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Meal extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'consumed_at',
        'meal_type',
        'name',
        'description',
        'photo_path',
        'calories',
        'protein',
        'carbs',
        'fat',
        'ai_analyzed',
        'ai_analysis',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'consumed_at' => 'datetime',
            'ai_analyzed' => 'boolean',
            'ai_analysis' => 'array',
            'protein' => 'decimal:2',
            'carbs' => 'decimal:2',
            'fat' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
