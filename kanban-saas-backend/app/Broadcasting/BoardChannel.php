<?php

namespace App\Broadcasting;

use App\Models\Board;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class BoardChannel
{
    /**
     * Authenticate the user's access to the channel.
     *
     * @param  \App\Models\User  $user
     * @param  int  $boardId
     * @return array|bool
     */
    public function join(User $user, $boardId)
    {
        $board = Board::findOrFail($boardId);
        $project = $board->project;
        $team = $project->team;
        
        // Check if user is a member of the team
        $isMember = DB::table('team_user')
            ->where('team_id', $team->id)
            ->where('user_id', $user->id)
            ->exists();
            
        if ($isMember) {
            return [
                'id' => $user->id,
                'name' => $user->name
            ];
        }
        
        return false;
    }
}