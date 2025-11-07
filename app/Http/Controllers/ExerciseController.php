<?php

namespace App\Http\Controllers;

use App\Models\Exercise;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ExerciseController extends Controller
{
    public function index(Request $request): Response
    {
        $exercises = $request->user()
            ->exercises()
            ->orderBy('date', 'desc')
            ->paginate(50);

        return Inertia::render('exercises/index', [
            'exercises' => $exercises,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'type' => 'required|string|max:255',
            'duration' => 'nullable|integer|min:0',
            'calories' => 'nullable|integer|min:0',
            'distance' => 'nullable|numeric|min:0',
            'heart_rate_avg' => 'nullable|integer|min:0',
            'source' => 'nullable|string|max:50',
            'apple_watch_data' => 'nullable|array',
            'notes' => 'nullable|string',
        ]);

        $request->user()->exercises()->create($validated);

        return redirect()->back()->with('success', 'Exercise logged successfully');
    }

    public function update(Request $request, Exercise $exercise): RedirectResponse
    {
        Gate::allowIf(fn (User $user) => $user->id === $exercise->user_id);

        $validated = $request->validate([
            'date' => 'required|date',
            'type' => 'required|string|max:255',
            'duration' => 'nullable|integer|min:0',
            'calories' => 'nullable|integer|min:0',
            'distance' => 'nullable|numeric|min:0',
            'heart_rate_avg' => 'nullable|integer|min:0',
            'source' => 'nullable|string|max:50',
            'apple_watch_data' => 'nullable|array',
            'notes' => 'nullable|string',
        ]);

        $exercise->update($validated);

        return redirect()->back()->with('success', 'Exercise updated successfully');
    }

    public function destroy(Exercise $exercise): RedirectResponse
    {
        Gate::allowIf(fn (User $user) => $user->id === $exercise->user_id);

        $exercise->delete();

        return redirect()->back()->with('success', 'Exercise deleted successfully');
    }
}
