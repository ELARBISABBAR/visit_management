<?php

namespace App\Http\Requests\Demandeur;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVisitRequest extends FormRequest
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
            'visitor_name' => ['required', 'string', 'max:255'],
            'visitor_type' => ['required', 'string', Rule::in(['visiteur', 'prestataire', 'fournisseur'])],
            'company' => ['nullable', 'string', 'max:255'],
            'department_id' => ['required', 'integer', 'exists:departments,id'],
            'visit_date' => ['required', 'date', 'after:today'],
            'visit_time' => ['required', 'date_format:H:i'],
            'reason' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'visitor_name.required' => 'Le nom du visiteur est obligatoire.',
            'visitor_type.required' => 'Le type de visiteur est obligatoire.',
            'visitor_type.in' => 'Le type de visiteur sélectionné est invalide.',
            'department_id.required' => 'Le département à visiter est obligatoire.',
            'department_id.exists' => 'Le département sélectionné est invalide.',
            'visit_date.required' => 'La date de visite est obligatoire.',
            'visit_date.after' => 'La date de visite doit être dans le futur.',
            'visit_time.required' => "L'heure de visite est obligatoire.",
            'visit_time.date_format' => "L'heure de visite doit être au format HH:MM.",
        ];
    }
}

