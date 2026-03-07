<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\DepartmentController as AdminDepartmentController;
use App\Http\Controllers\Admin\BadgeController as AdminBadgeController;
use App\Http\Controllers\Admin\SettingController as AdminSettingController;
use App\Http\Controllers\Accueil\DashboardController as AccueilDashboardController;
use App\Http\Controllers\Accueil\VisitController as AccueilVisitController;
use App\Http\Controllers\Demandeur\DashboardController as DemandeurDashboardController;
use App\Http\Controllers\Demandeur\VisitController as DemandeurVisitController;
use App\Http\Middleware\AccueilMiddleware;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\DemandeurMiddleware;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::prefix('demandeur')
        ->name('demandeur.')
        ->middleware([DemandeurMiddleware::class])
        ->group(function () {
            Route::get('dashboard', [DemandeurDashboardController::class, 'index'])->name('dashboard');

            Route::get('visites', [DemandeurVisitController::class, 'index'])->name('visites.index');
            Route::get('visites/nouvelle', [DemandeurVisitController::class, 'create'])->name('visites.create');
            Route::get('visites/historique', [DemandeurVisitController::class, 'history'])->name('visites.history');
            Route::post('visites', [DemandeurVisitController::class, 'store'])->name('visites.store');
            Route::get('visites/{visit}', [DemandeurVisitController::class, 'show'])->name('visites.show');
            Route::get('visites/{visit}/modifier', [DemandeurVisitController::class, 'edit'])->name('visites.edit');
            Route::put('visites/{visit}', [DemandeurVisitController::class, 'update'])->name('visites.update');
            Route::post('visites/{visit}/annuler', [DemandeurVisitController::class, 'cancel'])->name('visites.cancel');
        });

    Route::prefix('accueil')
        ->name('accueil.')
        ->middleware([AccueilMiddleware::class])
        ->group(function () {
            Route::get('dashboard', [AccueilDashboardController::class, 'index'])->name('dashboard');

            Route::get('visites', [AccueilVisitController::class, 'index'])->name('visites.index');
            Route::get('visites/nouvelle', [AccueilVisitController::class, 'create'])->name('visites.create');
            Route::post('visites', [AccueilVisitController::class, 'store'])->name('visites.store');
            Route::get('visites/{visit}', [AccueilVisitController::class, 'show'])->name('visites.show');
            Route::get('visites/{visit}/modifier', [AccueilVisitController::class, 'edit'])->name('visites.edit');
            Route::put('visites/{visit}', [AccueilVisitController::class, 'update'])->name('visites.update');
            Route::post('visites/{visit}/annuler', [AccueilVisitController::class, 'cancel'])->name('visites.cancel');
            Route::post('visites/{visit}/arrivee', [AccueilVisitController::class, 'checkIn'])->name('visites.check-in');
            Route::post('visites/{visit}/cloturer', [AccueilVisitController::class, 'checkOut'])->name('visites.check-out');
        });

    Route::prefix('admin')
        ->name('admin.')
        ->middleware([AdminMiddleware::class])
        ->group(function () {
            Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

            Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
            Route::get('/users/create', [AdminUserController::class, 'create'])->name('users.create');
            Route::post('/users', [AdminUserController::class, 'store'])->name('users.store');
            Route::get('/users/{user}/edit', [AdminUserController::class, 'edit'])->name('users.edit');
            Route::put('/users/{user}', [AdminUserController::class, 'update'])->name('users.update');
            Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');
            Route::put('/users/{user}/role', [AdminUserController::class, 'updateRole'])->name('users.update-role');

            Route::get('/departments', [AdminDepartmentController::class, 'index'])->name('departments.index');
            Route::get('/departments/create', [AdminDepartmentController::class, 'create'])->name('departments.create');
            Route::post('/departments', [AdminDepartmentController::class, 'store'])->name('departments.store');
            Route::get('/departments/{department}/edit', [AdminDepartmentController::class, 'edit'])->name('departments.edit');
            Route::put('/departments/{department}', [AdminDepartmentController::class, 'update'])->name('departments.update');
            Route::delete('/departments/{department}', [AdminDepartmentController::class, 'destroy'])->name('departments.destroy');

            Route::get('/badges', [AdminBadgeController::class, 'index'])->name('badges.index');
            Route::get('/badges/create', [AdminBadgeController::class, 'create'])->name('badges.create');
            Route::post('/badges', [AdminBadgeController::class, 'store'])->name('badges.store');
            Route::get('/badges/{badge}/edit', [AdminBadgeController::class, 'edit'])->name('badges.edit');
            Route::put('/badges/{badge}', [AdminBadgeController::class, 'update'])->name('badges.update');
            Route::delete('/badges/{badge}', [AdminBadgeController::class, 'destroy'])->name('badges.destroy');

            Route::get('/settings', [AdminSettingController::class, 'edit'])->name('settings.edit');
            Route::put('/settings', [AdminSettingController::class, 'update'])->name('settings.update');
            Route::post('/settings/test-smtp', [AdminSettingController::class, 'testSmtp'])->name('settings.test-smtp');
        });
});

require __DIR__.'/settings.php';
