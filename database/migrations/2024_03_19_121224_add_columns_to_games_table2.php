<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnsToGamesTable2 extends Migration
{
    public function up()
    {
        Schema::table('games', function (Blueprint $table) {
            $table->string('time')->nullable();
        });
    }

    public function down()
    {
        Schema::table('games', function (Blueprint $table) {
            $table->dropColumn(['time']);
        });
    }
}

