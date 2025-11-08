<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HealthSyncController extends Controller
{
    /**
     * Sync biometric data from Apple Health
     */
    public function syncBiometrics(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'data' => 'required|array',
            'data.*.type' => 'required|string',
            'data.*.value' => 'required|numeric',
            'data.*.unit' => 'required|string',
            'data.*.recorded_at' => 'required|date',
            'data.*.source' => 'nullable|string',
            'data.*.metadata' => 'nullable|array',
        ]);

        $synced = 0;

        DB::beginTransaction();
        try {
            foreach ($validated['data'] as $item) {
                $request->user()->biometrics()->updateOrCreate(
                    [
                        'type' => $item['type'],
                        'recorded_at' => $item['recorded_at'],
                    ],
                    [
                        'value' => $item['value'],
                        'unit' => $item['unit'],
                        'metadata' => array_merge($item['metadata'] ?? [], [
                            'source' => $item['source'] ?? 'apple_health',
                            'synced_at' => now(),
                        ]),
                    ]
                );
                $synced++;
            }
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Successfully synced {$synced} biometric records",
                'synced' => $synced,
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to sync biometric data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Sync exercise/workout data from Apple Health
     */
    public function syncExercises(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'data' => 'required|array',
            'data.*.type' => 'required|string',
            'data.*.date' => 'required|date',
            'data.*.duration' => 'nullable|integer',
            'data.*.calories' => 'nullable|integer',
            'data.*.distance' => 'nullable|numeric',
            'data.*.heart_rate_avg' => 'nullable|integer',
            'data.*.apple_watch_data' => 'nullable|array',
        ]);

        $synced = 0;

        DB::beginTransaction();
        try {
            foreach ($validated['data'] as $item) {
                $request->user()->exercises()->updateOrCreate(
                    [
                        'date' => $item['date'],
                        'type' => $item['type'],
                        'source' => 'apple_watch',
                    ],
                    [
                        'duration' => $item['duration'] ?? null,
                        'calories' => $item['calories'] ?? null,
                        'distance' => $item['distance'] ?? null,
                        'heart_rate_avg' => $item['heart_rate_avg'] ?? null,
                        'apple_watch_data' => array_merge($item['apple_watch_data'] ?? [], [
                            'synced_at' => now(),
                        ]),
                    ]
                );
                $synced++;
            }
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Successfully synced {$synced} exercise records",
                'synced' => $synced,
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to sync exercise data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get sync status and last sync time
     */
    public function syncStatus(Request $request): JsonResponse
    {
        $user = $request->user();

        $lastBiometricSync = $user->biometrics()
            ->whereNotNull('metadata->synced_at')
            ->latest('updated_at')
            ->first();

        $lastExerciseSync = $user->exercises()
            ->where('source', 'apple_watch')
            ->latest('updated_at')
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'biometrics' => [
                    'total_synced' => $user->biometrics()->whereNotNull('metadata->synced_at')->count(),
                    'last_sync' => $lastBiometricSync?->updated_at,
                ],
                'exercises' => [
                    'total_synced' => $user->exercises()->where('source', 'apple_watch')->count(),
                    'last_sync' => $lastExerciseSync?->updated_at,
                ],
            ],
        ], 200);
    }

    /**
     * Batch sync all health data
     */
    public function batchSync(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'biometrics' => 'nullable|array',
            'exercises' => 'nullable|array',
        ]);

        $results = [
            'biometrics' => ['synced' => 0, 'errors' => []],
            'exercises' => ['synced' => 0, 'errors' => []],
        ];

        // Sync biometrics if provided
        if (!empty($validated['biometrics'])) {
            $biometricsRequest = new Request(['data' => $validated['biometrics']]);
            $biometricsRequest->setUserResolver(fn () => $request->user());
            $biometricsResponse = $this->syncBiometrics($biometricsRequest);
            $results['biometrics'] = json_decode($biometricsResponse->getContent(), true);
        }

        // Sync exercises if provided
        if (!empty($validated['exercises'])) {
            $exercisesRequest = new Request(['data' => $validated['exercises']]);
            $exercisesRequest->setUserResolver(fn () => $request->user());
            $exercisesResponse = $this->syncExercises($exercisesRequest);
            $results['exercises'] = json_decode($exercisesResponse->getContent(), true);
        }

        return response()->json([
            'success' => true,
            'message' => 'Batch sync completed',
            'results' => $results,
        ], 200);
    }
}
