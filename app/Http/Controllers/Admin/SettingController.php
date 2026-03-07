<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\EmailSettingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class SettingController extends Controller
{
    public function __construct(
        private readonly EmailSettingService $emailSettingService,
    ) {
    }

    public function edit(): Response
    {
        $settings = $this->emailSettingService->getSettings();

        return Inertia::render('admin/settings/index', [
            'emailSettings' => $settings,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->smtpRules());

        $this->emailSettingService->updateOrCreate($validated);

        return back()->with('success', 'SMTP settings updated.');
    }

    public function testSmtp(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            ...$this->smtpRules(),
            'host' => ['required', 'string', 'max:255'],
            'port' => ['required', 'integer'],
            'test_email' => ['required', 'email', 'max:255'],
        ]);

        $scheme = $this->resolveSmtpScheme($validated['encryption'] ?? null);

        config([
            'mail.default' => 'smtp',
            'mail.mailers.smtp.transport' => 'smtp',
            'mail.mailers.smtp.host' => $validated['host'],
            'mail.mailers.smtp.port' => $validated['port'],
            'mail.mailers.smtp.username' => $validated['username'] ?? null,
            'mail.mailers.smtp.password' => $validated['password'] ?? null,
            'mail.mailers.smtp.scheme' => $scheme,
            'mail.from.address' => $validated['from_address'] ?? ($validated['username'] ?? 'hello@example.com'),
            'mail.from.name' => $validated['from_name'] ?? config('app.name'),
        ]);

        app('mail.manager')->forgetMailers();

        try {
            Mail::mailer('smtp')->raw(
                "Ceci est un email de test SMTP.\n\nConfiguration valide.",
                function ($message) use ($validated) {
                    $message
                        ->to($validated['test_email'])
                        ->subject('Test SMTP - Visitor Management');
                },
            );
        } catch (Throwable $exception) {
            return back()->withErrors([
                'smtp_test' => "Échec du test SMTP : {$exception->getMessage()}",
            ]);
        }

        return back()->with('success', 'Email de test envoyé avec succès.');
    }

    /**
     * @return array<string, array<int, string>>
     */
    private function smtpRules(): array
    {
        return [
            'host' => ['nullable', 'string', 'max:255'],
            'port' => ['nullable', 'integer'],
            'encryption' => ['nullable', 'string', 'max:20'],
            'username' => ['nullable', 'string', 'max:255'],
            'password' => ['nullable', 'string', 'max:255'],
            'from_address' => ['nullable', 'email', 'max:255'],
            'from_name' => ['nullable', 'string', 'max:255'],
        ];
    }

    private function resolveSmtpScheme(?string $encryption): ?string
    {
        if (! $encryption) {
            return null;
        }

        return match (strtolower(trim($encryption))) {
            'ssl', 'smtps' => 'smtps',
            'tls', 'smtp' => 'smtp',
            default => null,
        };
    }
}

