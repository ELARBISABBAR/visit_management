<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('visits', function (Blueprint $table) {
            $table->id();

            // Demandeur (employé qui crée la visite)
            $table->foreignId('demandeur_id')
                ->constrained('users')
                ->cascadeOnDelete();

            // Informations visiteur
            $table->string('visitor_name');
            $table->string('visitor_type'); // visiteur, prestataire, fournisseur
            $table->string('company')->nullable();

            // Département à visiter
            $table->foreignId('department_id')
                ->constrained()
                ->cascadeOnDelete();

            // Date / heure planifiées
            $table->dateTime('scheduled_at');

            // Motif
            $table->text('reason');

            // Statut métier (planned, in_progress, awaiting_badge_return, completed, cancelled)
            $table->string('status')->default('planned');

            // Données d'arrivée / badge (remplies par l'accueil)
            $table->dateTime('arrival_at')->nullable();
            $table->string('badge_color')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visits');
    }
};

