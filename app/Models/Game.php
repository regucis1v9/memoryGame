<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    protected $table = 'games';
    protected $fillable = ['userID', 'score'];
    
    public $timestamps = false; // Disable timestamps
}
