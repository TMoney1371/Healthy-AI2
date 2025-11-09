<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class PromoteAdminCommand extends Command
{
    protected $signature = 'user:promote-admin {email}';

    protected $description = 'Promote a user to admin by email';

    public function handle(): int
    {
        $email = $this->argument('email');
        
        $user = User::where('email', $email)->first();
        
        if (!$user) {
            $this->error("User with email '{$email}' not found.");
            return 1;
        }
        
        if ($user->is_admin) {
            $this->info("User '{$email}' is already an admin.");
            return 0;
        }
        
        $user->is_admin = true;
        $user->save();
        
        $this->info("✅ User '{$email}' has been promoted to admin!");
        return 0;
    }
}
