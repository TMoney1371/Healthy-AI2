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

    // Timeline / Calendar view
    Route::get('timeline', [\App\Http\Controllers\TimelineController::class, 'index'])->name('timeline.index');

    // Biometrics routes
    Route::get('biometrics', [\App\Http\Controllers\BiometricController::class, 'index'])->name('biometrics.index');
    Route::post('biometrics', [\App\Http\Controllers\BiometricController::class, 'store'])->name('biometrics.store');
    Route::patch('biometrics/{biometric}', [\App\Http\Controllers\BiometricController::class, 'update'])->name('biometrics.update');
    Route::delete('biometrics/{biometric}', [\App\Http\Controllers\BiometricController::class, 'destroy'])->name('biometrics.destroy');

    // Exercises routes
    Route::get('exercises', [\App\Http\Controllers\ExerciseController::class, 'index'])->name('exercises.index');
    Route::post('exercises', [\App\Http\Controllers\ExerciseController::class, 'store'])->name('exercises.store');
    Route::patch('exercises/{exercise}', [\App\Http\Controllers\ExerciseController::class, 'update'])->name('exercises.update');
    Route::delete('exercises/{exercise}', [\App\Http\Controllers\ExerciseController::class, 'destroy'])->name('exercises.destroy');

    // Meals routes
    Route::get('meals', [\App\Http\Controllers\MealController::class, 'index'])->name('meals.index');
    Route::post('meals', [\App\Http\Controllers\MealController::class, 'store'])->name('meals.store');
    Route::patch('meals/{meal}', [\App\Http\Controllers\MealController::class, 'update'])->name('meals.update');
    Route::delete('meals/{meal}', [\App\Http\Controllers\MealController::class, 'destroy'])->name('meals.destroy');
    Route::post('meals/analyze-photo', [\App\Http\Controllers\MealController::class, 'analyzePhoto'])->name('meals.analyze-photo');

    // Supplements routes
    Route::get('supplements', [\App\Http\Controllers\SupplementController::class, 'index'])->name('supplements.index');
    Route::post('supplements', [\App\Http\Controllers\SupplementController::class, 'store'])->name('supplements.store');
    Route::patch('supplements/{supplement}', [\App\Http\Controllers\SupplementController::class, 'update'])->name('supplements.update');
    Route::delete('supplements/{supplement}', [\App\Http\Controllers\SupplementController::class, 'destroy'])->name('supplements.destroy');

    // Apple Health Import routes
    Route::get('apple-health/import', [\App\Http\Controllers\AppleHealthImportController::class, 'index'])->name('apple-health.import');
    Route::post('apple-health/import', [\App\Http\Controllers\AppleHealthImportController::class, 'upload'])->name('apple-health.upload');

    // TC's Recommendations (public view)
    Route::get('recommendations', [\App\Http\Controllers\RecommendationController::class, 'index'])->name('recommendations.index');

    // Admin routes
    Route::prefix('admin')->middleware('admin')->group(function () {
        Route::get('recommendations', [\App\Http\Controllers\Admin\RecommendationController::class, 'index'])->name('admin.recommendations.index');
        Route::get('recommendations/create', [\App\Http\Controllers\Admin\RecommendationController::class, 'create'])->name('admin.recommendations.create');
        Route::post('recommendations', [\App\Http\Controllers\Admin\RecommendationController::class, 'store'])->name('admin.recommendations.store');
        Route::get('recommendations/{recommendation}/edit', [\App\Http\Controllers\Admin\RecommendationController::class, 'edit'])->name('admin.recommendations.edit');
        Route::patch('recommendations/{recommendation}', [\App\Http\Controllers\Admin\RecommendationController::class, 'update'])->name('admin.recommendations.update');
        Route::delete('recommendations/{recommendation}', [\App\Http\Controllers\Admin\RecommendationController::class, 'destroy'])->name('admin.recommendations.destroy');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
