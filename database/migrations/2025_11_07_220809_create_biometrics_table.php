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
        Schema::create('biometrics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('recorded_at');
            $table->string('type'); // sleep, weight, heart_rate, blood_pressure, etc.
            $table->decimal('value', 8, 2)->nullable();
            $table->string('unit')->nullable();
            $table->json('metadata')->nullable(); // for complex data like BP (systolic/diastolic)
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['user_id', 'recorded_at']);
            $table->index(['user_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('biometrics');
    }
};
