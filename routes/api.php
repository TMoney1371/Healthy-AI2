<?php

use App\Http\Controllers\Api\HealthSyncController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public API routes
Route::get('/health', function () {
    return response()->json(['status' => 'healthy', 'timestamp' => now()]);
});

// Protected API routes for iOS app
Route::middleware('auth:sanctum')->group(function () {
    // Health data sync endpoints
    Route::post('/sync/biometrics', [HealthSyncController::class, 'syncBiometrics']);
    Route::post('/sync/exercises', [HealthSyncController::class, 'syncExercises']);
    Route::post('/sync/batch', [HealthSyncController::class, 'batchSync']);
    Route::get('/sync/status', [HealthSyncController::class, 'syncStatus']);
    
    // User info endpoint
    Route::get('/user', function (Illuminate\Http\Request $request) {
        return response()->json($request->user());
    });
});
