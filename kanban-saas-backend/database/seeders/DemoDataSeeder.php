<?php

namespace Database\Seeders;

use App\Models\Board;
use App\Models\Card;
use App\Models\Column;
use App\Models\Project;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create demo admin user
        $admin = User::create([
            'name' => 'Demo Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
        ]);

        // Create demo team
        $team = Team::create([
            'name' => 'Demo Team',
            'slug' => 'demo-team',
            'description' => 'This is a demo team for testing purposes',
            'created_by' => $admin->id,
        ]);

        // Attach admin to team
        $team->users()->attach($admin->id, ['role' => 'admin']);

        // Create demo project
        $project = Project::create([
            'name' => 'Demo Project',
            'slug' => 'demo-project',
            'description' => 'This is a demo project for testing purposes',
            'team_id' => $team->id,
            'created_by' => $admin->id,
        ]);

        // Create demo board
        $board = Board::create([
            'name' => 'Demo Board',
            'description' => 'This is a demo board for testing purposes',
            'project_id' => $project->id,
            'created_by' => $admin->id,
        ]);

        // Create demo columns
        $todoColumn = Column::create([
            'name' => 'To Do',
            'position' => 0,
            'board_id' => $board->id,
        ]);

        $inProgressColumn = Column::create([
            'name' => 'In Progress',
            'position' => 1,
            'board_id' => $board->id,
        ]);

        $doneColumn = Column::create([
            'name' => 'Done',
            'position' => 2,
            'board_id' => $board->id,
        ]);

        // Create demo cards
        Card::create([
            'title' => 'Setup project environment',
            'description' => 'Install dependencies and configure development environment',
            'position' => 0,
            'column_id' => $todoColumn->id,
            'created_by' => $admin->id,
        ]);

        Card::create([
            'title' => 'Create database schema',
            'description' => 'Design and implement database tables and relationships',
            'position' => 1,
            'column_id' => $todoColumn->id,
            'created_by' => $admin->id,
        ]);

        Card::create([
            'title' => 'Implement authentication',
            'description' => 'Add user registration and login functionality',
            'position' => 0,
            'column_id' => $inProgressColumn->id,
            'created_by' => $admin->id,
        ]);

        Card::create([
            'title' => 'Project setup complete',
            'description' => 'Initial project configuration has been completed',
            'position' => 0,
            'column_id' => $doneColumn->id,
            'created_by' => $admin->id,
        ]);
    }
}