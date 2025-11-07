<?php

namespace App\Http\Controllers;

use App\Models\Meal;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MealController extends Controller
{
    public function index(Request $request): Response
    {
        $meals = $request->user()
            ->meals()
            ->orderBy('consumed_at', 'desc')
            ->paginate(50);

        return Inertia::render('meals/index', [
            'meals' => $meals,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'consumed_at' => 'required|date',
            'meal_type' => 'required|string|in:breakfast,lunch,dinner,snack',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'photo' => 'nullable|image|max:10240',
            'calories' => 'nullable|integer|min:0',
            'protein' => 'nullable|numeric|min:0',
            'carbs' => 'nullable|numeric|min:0',
            'fat' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo_path'] = $request->file('photo')->store('meals', 'public');
        }

        $request->user()->meals()->create($validated);

        return redirect()->back()->with('success', 'Meal logged successfully');
    }

    public function update(Request $request, Meal $meal): RedirectResponse
    {
        Gate::allowIf(fn (User $user) => $user->id === $meal->user_id);

        $validated = $request->validate([
            'consumed_at' => 'required|date',
            'meal_type' => 'required|string|in:breakfast,lunch,dinner,snack',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'photo' => 'nullable|image|max:10240',
            'calories' => 'nullable|integer|min:0',
            'protein' => 'nullable|numeric|min:0',
            'carbs' => 'nullable|numeric|min:0',
            'fat' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        if ($request->hasFile('photo')) {
            if ($meal->photo_path) {
                Storage::disk('public')->delete($meal->photo_path);
            }
            $validated['photo_path'] = $request->file('photo')->store('meals', 'public');
        }

        $meal->update($validated);

        return redirect()->back()->with('success', 'Meal updated successfully');
    }

    public function destroy(Meal $meal): RedirectResponse
    {
        Gate::allowIf(fn (User $user) => $user->id === $meal->user_id);

        if ($meal->photo_path) {
            Storage::disk('public')->delete($meal->photo_path);
        }

        $meal->delete();

        return redirect()->back()->with('success', 'Meal deleted successfully');
    }

    public function analyzePhoto(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'meal_id' => 'required|exists:meals,id',
        ]);

        $meal = Meal::findOrFail($validated['meal_id']);
        
        Gate::allowIf(fn (User $user) => $user->id === $meal->user_id);

        // Placeholder for AI analysis - you can integrate with OpenAI Vision API or similar
        $meal->update([
            'ai_analyzed' => true,
            'ai_analysis' => [
                'estimated_calories' => 650,
                'estimated_protein' => 35,
                'estimated_carbs' => 55,
                'estimated_fat' => 25,
                'confidence' => 0.85,
                'detected_items' => ['chicken breast', 'brown rice', 'broccoli'],
            ],
        ]);

        return redirect()->back()->with('success', 'Photo analyzed successfully');
    }
}
