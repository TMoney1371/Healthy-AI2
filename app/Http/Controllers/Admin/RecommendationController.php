<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Recommendation;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class RecommendationController extends Controller
{
    public function index(): Response
    {
        Gate::allowIf(fn (User $user) => $user->is_admin ?? false);

        $recommendations = Recommendation::withTrashed()
            ->orderBy('sort_order')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('admin/recommendations/index', [
            'recommendations' => $recommendations,
        ]);
    }

    public function create(): Response
    {
        Gate::allowIf(fn (User $user) => $user->is_admin ?? false);

        return Inertia::render('admin/recommendations/create');
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::allowIf(fn (User $user) => $user->is_admin);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'required|string',
            'link' => 'nullable|url|max:500',
            'image_url' => 'nullable|url|max:500',
            'price' => 'nullable|numeric|min:0',
            'why_i_recommend' => 'nullable|string',
            'is_published' => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);

        Recommendation::create($validated);

        return redirect()->route('admin.recommendations.index')->with('success', 'Recommendation created successfully');
    }

    public function edit(Recommendation $recommendation): Response
    {
        Gate::allowIf(fn (User $user) => $user->is_admin ?? false);

        return Inertia::render('admin/recommendations/edit', [
            'recommendation' => $recommendation,
        ]);
    }

    public function update(Request $request, Recommendation $recommendation): RedirectResponse
    {
        Gate::allowIf(fn (User $user) => $user->is_admin);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'required|string',
            'link' => 'nullable|url|max:500',
            'image_url' => 'nullable|url|max:500',
            'price' => 'nullable|numeric|min:0',
            'why_i_recommend' => 'nullable|string',
            'is_published' => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $recommendation->update($validated);

        return redirect()->route('admin.recommendations.index')->with('success', 'Recommendation updated successfully');
    }

    public function destroy(Recommendation $recommendation): RedirectResponse
    {
        Gate::authorize('admin');

        $recommendation->delete();

        return redirect()->back()->with('success', 'Recommendation deleted successfully');
    }
}
