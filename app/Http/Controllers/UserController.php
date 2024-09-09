<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Models\User;

class UserController extends Controller
{
    public function createUser(Request $request)
    {
        $validation = Validator::make($request->all(), [ 
            'name' => 'required|string|unique:users',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:8', // Minimum length of password set to 8
        ]);
    
        if ($validation->fails()) { 
            return response()->json(['error' => $validation->messages()]);
        } else {
            $validatedData = $validation->validated();
            try {
                $user = new User();
                $user->name = $validatedData['name'];
                $user->email = $validatedData['email'];
                $user->password = Hash::make($validatedData['password']);
                
                // Calculate password length
                $passwordLength = strlen($validatedData['password']);
                $user->password_length = $passwordLength;
    
                $user->save();
    
                return response()->json(['user' => $user]);
            } catch (\Exception $e) {
                return response()->json(['error' => 'Failed to create user', 'message' => $e->getMessage()]);
            }
        }
    }    

    public function login(Request $request)
    {
        $usernameExists = \App\Models\User::where('name', $request->name)->exists();
        if (!$usernameExists) {
            return response()->json(['error' => 'Username doesn\'t exist']);
        }
    
        // Validate user input
        $validation = Validator::make($request->all(), [ 
            'name' => 'required|string|exists:users',
            'password' => 'required|string',
        ]);
    
        // Proceed with password validation and authentication
        if ($validation->fails()) { 
            return response()->json(['error' => 'Invalid credentials']);
        } else {
            $validatedData = $validation->validated();
            try {
                // Attempt to authenticate the user
                $credentials = [
                    'name' => $request->name,
                    'password' => $request->password,
                ];
    
                if (Auth::attempt($credentials)) {
                    // Generate a new remember token
                    $user = Auth::user();
                    $user->remember_token = Str::random(60);
                    $user->save();
    
                    // Generate token for the authenticated user
                    $token = $user->createToken('auth_token')->plainTextToken;
    
                    return response()->json(['user' => $user, 'token' => $token]);
                } else {
                    return response()->json(['error' => 'Invalid credentials']);
                }
            } catch (\Exception $e) {
                return response()->json(['error' => 'Failed to authenticate user', 'message' => $e->getMessage()]);
            }
        }
    }

    public function logout(Request $request)
    {
        try {
            // Check if the user is authenticated
            if ($request->name) {
                // If authenticated, unset the remember token
                $user = User::where('name', $request->name)->first();
                if ($user) {
                    $user->remember_token = null;
                    $user->save();
                    return response()->json(['message' => 'User logged out successfully']);
                } else {
                    return response()->json(['message' => 'User not found']);
                }
            } else {
                return response()->json(['message' => 'User is not authenticated']);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to logout user', 'error' => $e->getMessage()]);
        }
    }

    public function updateGems(Request $request)
    {
        // Validate the request
        $validation = Validator::make($request->all(), [
            'userID' => 'required|integer|exists:users,id',
            'gems' => 'required|integer|min:0',
        ]);
    
        // If validation fails, return error messages
        if ($validation->fails()) {
            return response()->json(['error' => $validation->messages()]);
        } else {
            try {
                // Retrieve the user by ID
                $user = User::find($request->userID);
                $user->gems += $request->gems;
                $user->save();
    
                return response()->json(['message' => 'Gems updated successfully', 'user' => $user]);
            } catch (\Exception $e) {
                return response()->json(['error' => 'Failed to update gems', 'message' => $e->getMessage()]);
            }
        }
    }
    public function getUserById(Request $request)
    {
        // Validate the request
        $validation = Validator::make($request->all(), [
            'id' => 'required|integer|exists:users,id',
        ]);

        // If validation fails, return error messages
        if ($validation->fails()) {
            return response()->json(['error' => $validation->messages()]);
        } else {
            try {
                $user = User::find($request->id);

                if ($user) {
                    return response()->json(['user' => $user]);
                } else {
                    return response()->json(['message' => 'User not found']);
                }
            } catch (\Exception $e) {
                return response()->json(['error' => 'Failed to retrieve user data', 'message' => $e->getMessage()]);
            }
        }
    }
    public function checkPassword(Request $request)
    {
        // Validate the request
        $validation = Validator::make($request->all(), [
            'userID' => 'required|integer|exists:users,id',
            'password' => 'required|string',
        ]);

        if ($validation->fails()) {
            return response()->json(['error' => $validation->messages()]);
        } else {
            try {
                $user = User::find($request->userID);

                if ($user) {
                    if (Hash::check($request->password, $user->password)) {
                        return response()->json(['message' => 'Password matches']);
                    } else {
                        return response()->json(['error' => 'Password does not match']);
                    }
                } else {
                    return response()->json(['message' => 'User not found']);
                }
            } catch (\Exception $e) {
                return response()->json(['error' => 'Failed to check password', 'message' => $e->getMessage()]);
            }
        }
    }
    public function updateUser(Request $request)
    {
        // Validate the request
        $validation = Validator::make($request->all(), [
            'userID' => 'required|integer|exists:users,id',
            'name' => 'required|string',
            'email' => 'required|string|email',
            'password' => 'required|string|min:8',
        ]);
    
        // If validation fails, return error messages
        if ($validation->fails()) {
            return response()->json(['error' => $validation->messages()]);
        } else {
            try {
                // Retrieve the user by ID
                $user = User::find($request->userID);
    
                if ($user) {
                    // Check if the provided username is unique
                    $usernameExists = User::where('name', $request->name)
                        ->where('id', '!=', $user->id) // Exclude the current user
                        ->exists();
    
                    if ($usernameExists) {
                        // If username exists and belongs to another user, return an error
                        return response()->json(['error' => 'The username is already taken']);
                    } else {
                        // Calculate password length
                        $passwordLength = strlen($request->password);
    
                        // Update user details
                        $user->name = $request->name;
                        $user->email = $request->email;
                        $user->password = Hash::make($request->password);
                        $user->password_length = $passwordLength;
                        $user->save();
    
                        return response()->json(['message' => 'User updated successfully', 'user' => $user]);
                    }
                } else {
                    return response()->json(['message' => 'User not found']);
                }
            } catch (\Exception $e) {
                return response()->json(['error' => 'Failed to update user', 'message' => $e->getMessage()]);
            }
        }
    }
    
    public function googleLogin(Request $request)
    {
        $googleUser = $request->input('jwtData');
        \Log::info('Google User Data:', $googleUser);
    
        // Check if the "email" key exists in the $googleUser array
        if (isset($googleUser['email'])) {
            // Continue with the existing logic
            $user = User::where('email', $googleUser['email'])->first();
    
            if (!$user) {
                $user = User::create([
                    'email' => $googleUser['email'],
                    'gems' => 0
                ]);
            }
    
            // Generate a new remember token
            $user->remember_token = Str::random(60);
            $user->save();
    
            // Generate token for the authenticated user
            $token = $user->createToken('auth_token')->plainTextToken;
    
            return response()->json([
                'user' => $user,
                'token' => $token,
                'gems' => $user->gems
            ]);
        } else {
            // Handle the case where "email" key is not present
            return response()->json(['error' => 'Missing "email" key in Google user data'],);
        }
    }
    
    public function setUserPass(Request $request)
    {
        // Validate the request
        $validation = Validator::make($request->all(), [
            'userID' => 'required|integer|exists:users,id',
            'name' => 'required|string|unique:users',
            'password' => 'required|string|min:8',
        ]);
    
        // If validation fails, return error messages
        if ($validation->fails()) {
            return response()->json(['error' => $validation->messages()]);
        } else {
            try {
                // Retrieve the user by ID
                $user = User::find($request->userID);
    
                if ($user) {
                    // Update username if provided username is unique
                    $usernameExists = User::where('name', $request->name)
                        ->where('id', '!=', $user->id)
                        ->exists();
    
                    if ($usernameExists) {
                        return response()->json(['error' => 'The username is already taken']);
                    } else {
                        // Calculate password length
                        $passwordLength = strlen($request->password);
    
                        // Update user details
                        $user->name = $request->name;

                        $user->password = Hash::make($request->password);
                        $user->password_length = $passwordLength; // Update password_length column
                        $user->save();
    
                        return response()->json(['message' => 'Username and password updated successfully', 'user' => $user]);
                    }
                } else {
                    return response()->json(['message' => 'User not found']);
                }
            } catch (\Exception $e) {
                return response()->json(['error' => 'Failed to update username and password', 'message' => $e->getMessage()]);
            }
        }
    }
    


}
