<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('exercises', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->string('type'); // running, cycling, strength, yoga, etc.
            $table->integer('duration')->nullable(); // in minutes
            $table->integer('calories')->nullable();
            $table->decimal('distance', 8, 2)->nullable(); // in km or miles
            $table->integer('heart_rate_avg')->nullable();
            $table->string('source')->default('manual'); // manual, apple_watch, etc.
            $table->json('apple_watch_data')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['user_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exercises');
    }
};
