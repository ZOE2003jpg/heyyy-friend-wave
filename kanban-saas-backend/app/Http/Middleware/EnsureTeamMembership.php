<?php

namespace App\Http\Middleware;

use App\Models\Team;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureTeamMembership
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $teamId = $request->route('team');
        
        if ($teamId instanceof Team) {
            $team = $teamId;
        } else {
            $team = Team::findOrFail($teamId);
        }

        if (!Auth::user()->isMember($team)) {
            return response()->json([
                'message' => 'You are not a member of this team.',
            ], 403);
        }

        return $next($request);
    }
}