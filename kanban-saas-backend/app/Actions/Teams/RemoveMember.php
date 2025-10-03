<?php

namespace App\Actions\Teams;

use App\Models\Team;

class RemoveMember
{
    /**
     * Remove a member from a team.
     *
     * @param Team $team
     * @param int $userId
     * @return void
     */
    public function execute(Team $team, int $userId): void
    {
        $team->users()->detach($userId);
    }
}