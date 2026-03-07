<?php

namespace App\Http\Requests\Accueil;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVisitRequest extends FormRequest
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
            'is_event' => ['nullable', 'boolean'],
            'visitor_name' => ['exclude_if:is_event,1,true', 'required', 'string', 'max:255'],
            'event_name' => ['exclude_unless:is_event,1,true', 'required', 'string', 'max:255'],
            'event_visitors' => ['exclude_unless:is_event,1,true', 'array', 'min:1'],
            'event_visitors.*' => ['exclude_unless:is_event,1,true', 'required', 'string', 'max:255'],
            'visitor_type' => ['required', 'string', Rule::in(['visiteur', 'prestataire', 'fournisseur'])],
            'company' => ['nullable', 'string', 'max:255'],
            'demandeur_id' => ['required', 'integer', 'exists:users,id'],
            'department_id' => ['required', 'integer', 'exists:departments,id'],
            'visit_date' => ['required', 'date', 'after_or_equal:today'],
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
            'visitor_name.required_unless' => 'Le nom du visiteur est obligatoire pour une visite normale.',
            'event_name.required_if' => "Le nom de l'événement est obligatoire pour une visite événement.",
            'event_visitors.min' => "Ajoutez au moins un participant pour l'événement.",
            'event_visitors.*.required' => 'Chaque participant doit avoir un nom.',
            'visitor_type.required' => 'Le type de visiteur est obligatoire.',
            'demandeur_id.required' => 'Le demandeur est obligatoire.',
            'department_id.required' => 'Le département est obligatoire.',
            'visit_date.required' => 'La date de visite est obligatoire.',
            'visit_time.required' => "L'heure de visite est obligatoire.",
        ];
    }
}

