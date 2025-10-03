<?php

namespace Tests\Feature\Teams;

use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TeamManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_team()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/teams', [
            'name' => 'Test Team',
            'description' => 'This is a test team',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'id', 'name', 'slug', 'description', 'created_by'
            ]);

        $this->assertDatabaseHas('teams', [
            'name' => 'Test Team',
            'description' => 'This is a test team',
            'created_by' => $user->id,
        ]);
    }

    public function test_user_can_view_their_teams()
    {
        $user = User::factory()->create();
        $team = Team::factory()->create(['created_by' => $user->id]);
        $team->users()->attach($user->id, ['role' => 'admin']);
        
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/teams');

        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonStructure([
                '*' => ['id', 'name', 'slug', 'description', 'created_by']
            ]);
    }

    public function test_user_can_invite_member_to_team()
    {
        $admin = User::factory()->create();
        $newMember = User::factory()->create();
        
        $team = Team::factory()->create(['created_by' => $admin->id]);
        $team->users()->attach($admin->id, ['role' => 'admin']);
        
        $token = $admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/teams/{$team->id}/members/invite", [
            'email' => $newMember->email,
            'role' => 'member',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('team_user', [
            'team_id' => $team->id,
            'user_id' => $newMember->id,
            'role' => 'member',
        ]);
    }

    public function test_admin_can_remove_member_from_team()
    {
        $admin = User::factory()->create();
        $member = User::factory()->create();
        
        $team = Team::factory()->create(['created_by' => $admin->id]);
        $team->users()->attach($admin->id, ['role' => 'admin']);
        $team->users()->attach($member->id, ['role' => 'member']);
        
        $token = $admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->deleteJson("/api/teams/{$team->id}/members/{$member->id}");

        $response->assertStatus(200);

        $this->assertDatabaseMissing('team_user', [
            'team_id' => $team->id,
            'user_id' => $member->id,
        ]);
    }
}