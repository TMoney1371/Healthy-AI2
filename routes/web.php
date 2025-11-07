<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('home', [
        // OG tags are set via shared props by default
        // Override here if needed:
        // 'ogTitle' => 'Custom Homepage Title',
        // 'ogDescription' => 'Custom description for homepage',
    ]);
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard', [
            // OG tags are set via shared props by default
            // Override here if needed:
            // 'ogTitle' => 'Dashboard - '.config('app.name'),
            // 'ogDescription' => 'Your dashboard',
        ]);
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
