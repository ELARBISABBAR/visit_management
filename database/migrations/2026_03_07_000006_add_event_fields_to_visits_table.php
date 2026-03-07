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
        Schema::table('visits', function (Blueprint $table) {
            $table->boolean('is_event')->default(false)->after('visitor_name');
            $table->string('event_name')->nullable()->after('is_event');
            $table->text('event_visitors')->nullable()->after('event_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('visits', function (Blueprint $table) {
            $table->dropColumn(['is_event', 'event_name', 'event_visitors']);
        });
    }
};

