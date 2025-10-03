<?php

namespace App\Http\Controllers;

use App\Actions\Teams\AddMember;
use App\Actions\Teams\RemoveMember;
use App\Http\Requests\Teams\InviteMemberRequest;
use App\Jobs\SendTeamInviteEmail;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class TeamsController extends Controller
{
    /**
     * Display a listing of the teams.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $teams = Auth::user()->teams;
        return response()->json($teams);
    }

    /**
     * Store a newly created team.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $team = Team::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name) . '-' . Str::random(5),
            'owner_id' => Auth::id(),
        ]);

        // Add the creator as a team member with owner role
        $team->users()->attach(Auth::id(), ['role' => 'owner']);

        return response()->json($team, 201);
    }

    /**
     * Display the specified team.
     *
     * @param  \App\Models\Team  $team
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Team $team)
    {
        $this->authorize('view', $team);
        
        return response()->json([
            'team' => $team,
            'members' => $team->users,
        ]);
    }

    /**
     * Update the specified team.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Team  $team
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Team $team)
    {
        $this->authorize('update', $team);
        
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $team->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name) . '-' . Str::random(5),
        ]);

        return response()->json($team);
    }

    /**
     * Remove the specified team.
     *
     * @param  \App\Models\Team  $team
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Team $team)
    {
        $this->authorize('delete', $team);
        
        $team->delete();

        return response()->json(null, 204);
    }

    /**
     * Invite a new member to the team.
     *
     * @param  \App\Http\Requests\Teams\InviteMemberRequest  $request
     * @param  \App\Models\Team  $team
     * @return \Illuminate\Http\JsonResponse
     */
    public function inviteMember(InviteMemberRequest $request, Team $team)
    {
        $this->authorize('update', $team);
        
        $inviteToken = Str::random(32);
        
        // Store invitation in database
        $invitation = $team->invitations()->create([
            'email' => $request->email,
            'role' => $request->role,
            'token' => $inviteToken,
        ]);
        
        // Dispatch job to send invitation email
        SendTeamInviteEmail::dispatch($team, $invitation, Auth::user());
        
        return response()->json([
            'message' => 'Invitation sent successfully',
            'invitation' => $invitation
        ]);
    }

    /**
     * Add a member to the team.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Team  $team
     * @return \Illuminate\Http\JsonResponse
     */
    public function addMember(Request $request, Team $team)
    {
        $this->authorize('update', $team);
        
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'required|string|in:member,admin',
        ]);
        
        $addMember = new AddMember();
        $addMember->execute($team, $request->user_id, $request->role);
        
        return response()->json([
            'message' => 'Member added successfully'
        ]);
    }

    /**
     * Remove a member from the team.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Team  $team
     * @return \Illuminate\Http\JsonResponse
     */
    public function removeMember(Request $request, Team $team)
    {
        $this->authorize('update', $team);
        
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);
        
        // Cannot remove the team owner
        if ($team->owner_id == $request->user_id) {
            return response()->json([
                'message' => 'Cannot remove the team owner'
            ], 403);
        }
        
        $removeMember = new RemoveMember();
        $removeMember->execute($team, $request->user_id);
        
        return response()->json([
            'message' => 'Member removed successfully'
        ]);
    }
}