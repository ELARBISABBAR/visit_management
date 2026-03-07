<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Badge;
use App\Services\Admin\BadgeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class BadgeController extends Controller
{
    public function __construct(
        private readonly BadgeService $badgeService,
    ) {
    }

    public function index(): Response
    {
        $badges = $this->badgeService->paginateBadges();

        return Inertia::render('admin/badges/index', [
            'badges' => $badges,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/badges/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:255', 'unique:badges,code'],
            'label' => ['nullable', 'string', 'max:255'],
            'visitor_type' => ['required', 'string', Rule::in(['visiteur', 'prestataire', 'fournisseur'])],
        ]);

        $validated['status'] = 'available';
        $this->badgeService->create($validated);

        return redirect()->route('admin.badges.index')->with('success', 'Badge created.');
    }

    public function edit(Badge $badge): Response
    {
        return Inertia::render('admin/badges/edit', [
            'badge' => $badge,
        ]);
    }

    public function update(Request $request, Badge $badge): RedirectResponse
    {
        $validated = $request->validate([
            'code' => [
                'required',
                'string',
                'max:255',
                'unique:badges,code,'.$badge->id,
            ],
            'label' => ['nullable', 'string', 'max:255'],
            'visitor_type' => ['required', 'string', Rule::in(['visiteur', 'prestataire', 'fournisseur'])],
        ]);

        $validated['status'] = $badge->status;
        $this->badgeService->update($badge, $validated);

        return redirect()->route('admin.badges.index')->with('success', 'Badge updated.');
    }

    public function destroy(Badge $badge): RedirectResponse
    {
        $this->badgeService->delete($badge);

        return redirect()->route('admin.badges.index')->with('success', 'Badge deleted.');
    }
}

