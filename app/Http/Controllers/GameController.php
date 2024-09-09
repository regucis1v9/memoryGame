<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Game;
use App\Models\Completed; // Import the Completed model
use App\Models\User; // Import the User model

class GameController extends Controller
{
    // Function to create a new game and add data to the completed table
    public function newGame(Request $request)
    {
        // Validate user input
        $validation = Validator::make($request->all(), [ 
            'userID' => 'required|integer',
            'score' => 'required|integer',
            'difficulty' => 'required|string',
            'grid' => 'required|string',
            'time' => 'required|integer'
        ]);

        // If validation fails, return error messages
        if ($validation->fails()) { 
            return response()->json(['error' => $validation->messages()]);
        } else {
            $validatedData = $validation->validated();
            try {
                // Check if a completed record with the same grid, difficulty, and userID already exists
                $existingCompleted = Completed::where('grid', $validatedData['grid'])
                    ->where('difficulty', $validatedData['difficulty'])
                    ->where('userID', $validatedData['userID'])
                    ->exists();

                // If a completed record already exists, return a success response without performing any further action
                if ($existingCompleted) {
                    return response()->json(['message' => 'This completion already exists']);
                }

                // Create a new Game instance and save it
                $game = new Game();
                $game->userID = $validatedData['userID'];
                $game->score = $validatedData['score'];
                $game->difficulty = $validatedData['difficulty'];
                $game->grid = $validatedData['grid'];
                $game->time = $validatedData['time'];
                $game->save();

                // Only add data to the completed table if no completed record already exists
                if (!$existingCompleted) {
                    $completed = new Completed();
                    $completed->userID = $validatedData['userID'];
                    $completed->grid = $validatedData['grid'];
                    $completed->difficulty = $validatedData['difficulty'];
                    $completed->save();
                }

                return response()->json(['game' => $game]);
            } catch (\Exception $e) {
                return response()->json(['error' => 'Failed to save game or completed level', 'message' => $e->getMessage()]);
            }
        }
    }

    // Function to retrieve all games
    public function getAllGames()
    {
        try {
            $games = Game::orderBy('score', 'desc')
                         ->orderBy('time', 'asc')
                         ->orderByRaw("FIELD(difficulty, 'hard', 'medium', 'easy') DESC")
                         ->get(); 
            $games->transform(function ($game) {
                // Retrieve the user associated with the game
                $user = User::find($game->userID);
                if ($user) {
                    // Replace userID with username in the game object
                    $game->username = $user->name; // Assuming 'name' is the field storing the username
                    unset($game->userID); // Remove the userID field from the response
                }
                return $game;
            });
    
            return response()->json(['games' => $games]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to retrieve games', 'message' => $e->getMessage()]);
        }
    }

    // Function to retrieve games based on user ID
    public function getUserGames(Request $request)
    {
        // Validate user input
        $validation = Validator::make($request->all(), [
            'userID' => 'required|integer', // Ensure userID is provided and is an integer
        ]);

        // If validation fails, return error messages
        if ($validation->fails()) {
            return response()->json(['error' => $validation->messages()]);
        } else {
            $validatedData = $validation->validated();
            try {
                $userID = $validatedData['userID'];

                // Retrieve games associated with the given userID
                $games = Game::where('userID', $userID)
                             ->orderBy('score', 'desc')
                             ->orderBy('time', 'asc')
                             ->orderByRaw("FIELD(difficulty, 'hard', 'medium', 'easy') DESC")
                             ->get(); 

                // Transform game objects to include username instead of userID
                $games->transform(function ($game) {
                    // Retrieve the user associated with the game
                    $user = User::find($game->userID);
                    if ($user) {
                        // Replace userID with username in the game object
                        $game->username = $user->name; // Assuming 'name' is the field storing the username
                        unset($game->userID); // Remove the userID field from the response
                    }
                    return $game;
                });

                return response()->json(['games' => $games]);
            } catch (\Exception $e) {
                return response()->json(['error' => 'Failed to retrieve user games', 'message' => $e->getMessage()]);
            }
        }
    }
    public function getUserCompletions(Request $request)
    {
        // Validate user input
        $validation = Validator::make($request->all(), [
            'userID' => 'required|integer', // Ensure userID is provided and is an integer
        ]);

        // If validation fails, return error messages
        if ($validation->fails()) {
            return response()->json(['error' => $validation->messages()]);
        } else {
            $validatedData = $validation->validated();
            try {
                $userID = $validatedData['userID'];

                // Retrieve completions associated with the given userID
                $completions = Completed::where('userID', $userID)->get();

                return response()->json(['completions' => $completions]);
            } catch (\Exception $e) {
                return response()->json(['error' => 'Failed to retrieve user completions', 'message' => $e->getMessage()]);
            }
        }
    }
}
