<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use App\Models\EmailSetting;
use App\Models\User;
use App\Policies\UserPolicy;
use App\Models\Visit;
use App\Policies\VisitPolicy;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureMailFromDatabase();

        Gate::policy(User::class, UserPolicy::class);
        Gate::policy(Visit::class, VisitPolicy::class);
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }

    protected function configureMailFromDatabase(): void
    {
        if (! Schema::hasTable('email_settings')) {
            return;
        }

        $emailSetting = EmailSetting::query()->first();

        if (! $emailSetting || ! $emailSetting->host || ! $emailSetting->port) {
            return;
        }

        $scheme = match (strtolower((string) $emailSetting->encryption)) {
            'ssl', 'smtps' => 'smtps',
            'tls', 'smtp' => 'smtp',
            default => null,
        };

        config([
            'mail.default' => 'smtp',
            'mail.mailers.smtp.transport' => 'smtp',
            'mail.mailers.smtp.host' => $emailSetting->host,
            'mail.mailers.smtp.port' => $emailSetting->port,
            'mail.mailers.smtp.username' => $emailSetting->username,
            'mail.mailers.smtp.password' => $emailSetting->password,
            'mail.mailers.smtp.scheme' => $scheme,
            'mail.from.address' => $emailSetting->from_address ?: ($emailSetting->username ?: config('mail.from.address')),
            'mail.from.name' => $emailSetting->from_name ?: config('app.name'),
        ]);
    }
}
