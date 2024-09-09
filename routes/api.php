<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GameController;

Route::post('/register', [UserController::class, 'createUser']);
Route::post('/login', [UserController::class, 'login']);
Route::post('/logout', [UserController::class, 'logout']); 
Route::post('/newGame', [GameController::class, 'newGame']);
Route::get('/getGames', [GameController::class, 'getAllGames']);
Route::post('/updateGems', [UserController::class, 'updateGems']);
Route::post("/getUserGames",[GameController::class, 'getUserGames']);
Route::post("/getUserByID", [UserController::class, 'getUserById']);
Route::post("/checkPassword", [UserController::class, 'checkPassword']);
Route::post("/updateUser", [UserController::class, 'updateUser']);
Route::post("/googleLogin", [UserController::class, 'googleLogin']);
Route::post("/googleRegister", [UserController::class, 'googleRegister']);
Route::post("/setUserPass", [UserController::class, 'setUserPass']);
Route::post("/getUserCompletions", [GameController::class, 'getUserCompletions']);
