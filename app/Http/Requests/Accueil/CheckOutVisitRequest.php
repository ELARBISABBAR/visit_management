<?php

namespace App\Http\Requests\Accueil;

use Illuminate\Foundation\Http\FormRequest;

class CheckOutVisitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'badge_returned' => ['required', 'accepted'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'badge_returned.required' => 'Le retour du badge doit être confirmé.',
            'badge_returned.accepted' => 'La visite ne peut pas être clôturée si le badge n’est pas retourné.',
        ];
    }
}

