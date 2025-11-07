<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TimelineController extends Controller
{
    public function index(Request $request): Response
    {
        $startDate = $request->query('start', now()->subDays(30)->format('Y-m-d'));
        $endDate = $request->query('end', now()->format('Y-m-d'));

        $user = $request->user();

        // Get all health data for the date range
        $biometrics = $user->biometrics()
            ->whereBetween('recorded_at', [$startDate, $endDate])
            ->orderBy('recorded_at')
            ->get();

        $exercises = $user->exercises()
            ->whereBetween('date', [$startDate, $endDate])
            ->orderBy('date')
            ->get();

        $meals = $user->meals()
            ->whereBetween('consumed_at', [$startDate, $endDate])
            ->orderBy('consumed_at')
            ->get();

        $supplements = $user->supplements()
            ->whereBetween('taken_at', [$startDate, $endDate])
            ->orderBy('taken_at')
            ->get();

        // Calculate summary stats
        $stats = [
            'total_exercises' => $exercises->count(),
            'total_calories_burned' => $exercises->sum('calories'),
            'total_meals' => $meals->count(),
            'total_calories_consumed' => $meals->sum('calories'),
            'avg_protein' => $meals->avg('protein'),
            'total_supplements' => $supplements->count(),
        ];

        return Inertia::render('timeline/index', [
            'biometrics' => $biometrics,
            'exercises' => $exercises,
            'meals' => $meals,
            'supplements' => $supplements,
            'stats' => $stats,
            'startDate' => $startDate,
            'endDate' => $endDate,
        ]);
    }
}
