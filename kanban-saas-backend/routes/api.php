<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TeamsController;
use App\Http\Controllers\ProjectsController;
use App\Http\Controllers\BoardsController;
use App\Http\Controllers\ColumnsController;
use App\Http\Controllers\CardsController;
use App\Http\Controllers\CommentsController;
use App\Http\Controllers\FilesController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::prefix('v1')->group(function () {
    // Auth routes
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});

// Protected routes
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    // User profile
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/user', [AuthController::class, 'updateProfile']);
    
    // Teams
    Route::apiResource('teams', TeamsController::class);
    Route::post('/teams/{team}/invite', [TeamsController::class, 'invite']);
    Route::post('/teams/{team}/members/{user}', [TeamsController::class, 'updateMember']);
    Route::delete('/teams/{team}/members/{user}', [TeamsController::class, 'removeMember']);
    
    // Team context middleware
    Route::middleware('team.context')->group(function () {
        // Projects
        Route::apiResource('projects', ProjectsController::class);
        
        // Boards
        Route::apiResource('projects.boards', BoardsController::class);
        
        // Columns
        Route::apiResource('boards.columns', ColumnsController::class);
        
        // Cards
        Route::apiResource('columns.cards', CardsController::class);
        Route::post('/cards/{card}/move', [CardsController::class, 'move']);
        
        // Comments
        Route::apiResource('cards.comments', CommentsController::class);
        
        // Files/Attachments
        Route::post('/cards/{card}/attachments', [FilesController::class, 'store']);
        Route::delete('/attachments/{attachment}', [FilesController::class, 'destroy']);
    });
});