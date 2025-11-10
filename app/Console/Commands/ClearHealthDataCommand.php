<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class ClearHealthDataCommand extends Command
{
    protected $signature = 'health:clear {email}';

    protected $description = 'Clear all health data for a specific user';

    public function handle(): int
    {
        $email = $this->argument('email');
        
        $user = User::where('email', $email)->first();
        
        if (!$user) {
            $this->error("User with email '{$email}' not found.");
            return 1;
        }
        
        $this->info("Clearing health data for {$user->name} ({$email})...");
        
        $exercisesCount = $user->exercises()->count();
        $biometricsCount = $user->biometrics()->count();
        $mealsCount = $user->meals()->count();
        $supplementsCount = $user->supplements()->count();
        
        $user->exercises()->forceDelete();
        $user->biometrics()->forceDelete();
        $user->meals()->forceDelete();
        $user->supplements()->forceDelete();
        
        $this->info("✅ Deleted:");
        $this->info("   - {$exercisesCount} exercises");
        $this->info("   - {$biometricsCount} biometrics");
        $this->info("   - {$mealsCount} meals");
        $this->info("   - {$supplementsCount} supplements");
        $this->info("\n✨ Database cleared! Ready for fresh import.");
        
        return 0;
    }
}
