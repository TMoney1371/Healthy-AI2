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
        Schema::create('meals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->dateTime('consumed_at');
            $table->string('meal_type'); // breakfast, lunch, dinner, snack
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('photo_path')->nullable();
            $table->integer('calories')->nullable();
            $table->decimal('protein', 8, 2)->nullable(); // in grams
            $table->decimal('carbs', 8, 2)->nullable(); // in grams
            $table->decimal('fat', 8, 2)->nullable(); // in grams
            $table->boolean('ai_analyzed')->default(false);
            $table->json('ai_analysis')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['user_id', 'consumed_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meals');
    }
};
