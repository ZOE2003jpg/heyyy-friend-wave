<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Board;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('board.{boardId}', function ($user, $boardId) {
    $board = Board::findOrFail($boardId);
    return $board->project->team->hasMember($user);
});

Broadcast::channel('team.{teamId}', function ($user, $teamId) {
    return $user->teams()->where('teams.id', $teamId)->exists();
});