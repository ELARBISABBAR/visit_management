<?php

namespace App\Services\Admin;

use App\Models\EmailSetting;

class EmailSettingService
{
    public function getSettings(): ?EmailSetting
    {
        return EmailSetting::query()->first();
    }

    public function updateOrCreate(array $data): EmailSetting
    {
        return EmailSetting::query()->updateOrCreate(
            ['id' => optional($this->getSettings())->id],
            $data,
        );
    }
}

