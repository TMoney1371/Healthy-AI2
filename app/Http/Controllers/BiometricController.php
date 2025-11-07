<?php

namespace App\Http\Controllers;

use App\Models\Biometric;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class BiometricController extends Controller
{
    public function index(Request $request): Response
    {
        $biometrics = $request->user()
            ->biometrics()
            ->orderBy('recorded_at', 'desc')
            ->paginate(50);

        return Inertia::render('biometrics/index', [
            'biometrics' => $biometrics,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'recorded_at' => 'required|date',
            'type' => 'required|string|max:255',
            'value' => 'nullable|numeric',
            'unit' => 'nullable|string|max:50',
            'metadata' => 'nullable|array',
            'notes' => 'nullable|string',
        ]);

        $request->user()->biometrics()->create($validated);

        return redirect()->back()->with('success', 'Biometric data recorded successfully');
    }

    public function update(Request $request, Biometric $biometric): RedirectResponse
    {
        Gate::allowIf(fn (User $user) => $user->id === $biometric->user_id);

        $validated = $request->validate([
            'recorded_at' => 'required|date',
            'type' => 'required|string|max:255',
            'value' => 'nullable|numeric',
            'unit' => 'nullable|string|max:50',
            'metadata' => 'nullable|array',
            'notes' => 'nullable|string',
        ]);

        $biometric->update($validated);

        return redirect()->back()->with('success', 'Biometric data updated successfully');
    }

    public function destroy(Biometric $biometric): RedirectResponse
    {
        Gate::allowIf(fn (User $user) => $user->id === $biometric->user_id);

        $biometric->delete();

        return redirect()->back()->with('success', 'Biometric data deleted successfully');
    }
}
