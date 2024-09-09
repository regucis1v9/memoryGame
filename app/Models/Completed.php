<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Completed extends Model
{
    protected $table = 'completed';

    protected $fillable = [
        'userID',
        'grid',
        'difficulty',
    ];

    // If you don't have timestamps in your completed table
    public $timestamps = false;

    // Define any relationships or custom functionality here
}
