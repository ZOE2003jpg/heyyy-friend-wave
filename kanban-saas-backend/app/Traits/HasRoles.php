<?php

namespace App\Traits;

use App\Models\Team;

trait HasRoles
{
    /**
     * Check if the user has a specific role in a team.
     *
     * @param Team $team
     * @param string $role
     * @return bool
     */
    public function hasRole(Team $team, string $role): bool
    {
        return $this->teams()
            ->wherePivot('team_id', $team->id)
            ->wherePivot('role', $role)
            ->exists();
    }

    /**
     * Check if the user is an admin of a team.
     *
     * @param Team $team
     * @return bool
     */
    public function isAdmin(Team $team): bool
    {
        return $this->hasRole($team, 'admin');
    }

    /**
     * Check if the user is a member of a team.
     *
     * @param Team $team
     * @return bool
     */
    public function isMember(Team $team): bool
    {
        return $this->teams()
            ->wherePivot('team_id', $team->id)
            ->exists();
    }

    /**
     * Get the user's role in a team.
     *
     * @param Team $team
     * @return string|null
     */
    public function roleInTeam(Team $team): ?string
    {
        $teamUser = $this->teams()
            ->wherePivot('team_id', $team->id)
            ->first();
            
        return $teamUser ? $teamUser->pivot->role : null;
    }
}