<?php

namespace App\Http\Controllers;

use App\Models\Supplement;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class SupplementController extends Controller
{
    public function index(Request $request): Response
    {
        $supplements = $request->user()
            ->supplements()
            ->orderBy('taken_at', 'desc')
            ->paginate(50);

        return Inertia::render('supplements/index', [
            'supplements' => $supplements,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'taken_at' => 'required|date',
            'name' => 'required|string|max:255',
            'dosage' => 'nullable|string|max:255',
            'unit' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
        ]);

        $request->user()->supplements()->create($validated);

        return redirect()->back()->with('success', 'Supplement logged successfully');
    }

    public function update(Request $request, Supplement $supplement): RedirectResponse
    {
        Gate::allowIf(fn (User $user) => $user->id === $supplement->user_id);

        $validated = $request->validate([
            'taken_at' => 'required|date',
            'name' => 'required|string|max:255',
            'dosage' => 'nullable|string|max:255',
            'unit' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
        ]);

        $supplement->update($validated);

        return redirect()->back()->with('success', 'Supplement updated successfully');
    }

    public function destroy(Supplement $supplement): RedirectResponse
    {
        Gate::allowIf(fn (User $user) => $user->id === $supplement->user_id);

        $supplement->delete();

        return redirect()->back()->with('success', 'Supplement deleted successfully');
    }
}
