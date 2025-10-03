<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProjectResource;
use App\Models\Project;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class ProjectsController extends Controller
{
    /**
     * Display a listing of the projects for a team.
     *
     * @param Team $team
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Team $team)
    {
        $this->authorize('viewAny', [Project::class, $team]);
        
        $projects = $team->projects;
        return ProjectResource::collection($projects);
    }

    /**
     * Store a newly created project.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  Team  $team
     * @return ProjectResource
     */
    public function store(Request $request, Team $team)
    {
        $this->authorize('create', [Project::class, $team]);
        
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $project = $team->projects()->create([
            'name' => $request->name,
            'description' => $request->description,
            'slug' => Str::slug($request->name) . '-' . Str::random(5),
            'created_by' => Auth::id(),
        ]);

        return new ProjectResource($project);
    }

    /**
     * Display the specified project.
     *
     * @param  Team  $team
     * @param  \App\Models\Project  $project
     * @return ProjectResource
     */
    public function show(Team $team, Project $project)
    {
        $this->authorize('view', [$project, $team]);
        
        return new ProjectResource($project->load('boards'));
    }

    /**
     * Update the specified project.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  Team  $team
     * @param  \App\Models\Project  $project
     * @return ProjectResource
     */
    public function update(Request $request, Team $team, Project $project)
    {
        $this->authorize('update', [$project, $team]);
        
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $project->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return new ProjectResource($project);
    }

    /**
     * Remove the specified project.
     *
     * @param  Team  $team
     * @param  \App\Models\Project  $project
     * @return \Illuminate\Http\Response
     */
    public function destroy(Team $team, Project $project)
    {
        $this->authorize('delete', [$project, $team]);
        
        $project->delete();

        return response()->noContent();
    }
}