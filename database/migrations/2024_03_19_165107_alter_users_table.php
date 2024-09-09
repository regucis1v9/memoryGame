<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterUsersTable extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop the timestamps
            $table->dropTimestamps();
            
            // Drop the email_verified_at column
            $table->dropColumn('email_verified_at');
            
            // Add the gems column
            $table->integer('gems')->default(0); // Change data type if needed
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            // Reverse the operations in the "up" method
            $table->timestamps();
            $table->timestamp('email_verified_at')->nullable();
            $table->dropColumn('gems');
        });
    }
}
