<?php

namespace App\Actions\Teams;

use App\Models\Team;

class AddMember
{
    /**
     * Add a member to a team with the specified role.
     *
     * @param Team $team
     * @param int $userId
     * @param string $role
     * @return void
     */
    public function execute(Team $team, int $userId, string $role): void
    {
        $team->users()->attach($userId, ['role' => $role]);
    }
}