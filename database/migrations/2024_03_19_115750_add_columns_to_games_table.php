<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnsToGamesTable extends Migration
{
    public function up()
    {
        Schema::table('games', function (Blueprint $table) {
            $table->string('difficulty')->nullable();
            $table->string('grid')->nullable();
        });
    }

    public function down()
    {
        Schema::table('games', function (Blueprint $table) {
            $table->dropColumn(['difficulty', 'grid']);
        });
    }
}

