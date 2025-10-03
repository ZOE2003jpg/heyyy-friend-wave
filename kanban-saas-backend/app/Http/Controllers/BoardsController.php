<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\Project;
use App\Models\Team;
use App\Services\BoardService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BoardsController extends Controller
{
    protected $boardService;

    public function __construct(BoardService $boardService)
    {
        $this->boardService = $boardService;
    }

    /**
     * Display a listing of the boards for a project.
     *
     * @param Team $team
     * @param Project $project
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Team $team, Project $project)
    {
        $this->authorize('view', [$project, $team]);
        
        $boards = $project->boards;
        return response()->json($boards);
    }

    /**
     * Store a newly created board.
     *
     * @param Request $request
     * @param Team $team
     * @param Project $project
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request, Team $team, Project $project)
    {
        $this->authorize('update', [$project, $team]);
        
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $board = $project->boards()->create([
            'name' => $request->name,
            'created_by' => Auth::id(),
        ]);

        // Create default columns
        $this->boardService->createDefaultColumns($board);

        return response()->json($board, 201);
    }

    /**
     * Display the specified board with columns and cards.
     *
     * @param Team $team
     * @param Project $project
     * @param Board $board
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Team $team, Project $project, Board $board)
    {
        $this->authorize('view', [$project, $team]);
        
        $board->load(['columns.cards' => function($query) {
            $query->orderBy('position');
        }]);
        
        return response()->json($board);
    }

    /**
     * Update the specified board.
     *
     * @param Request $request
     * @param Team $team
     * @param Project $project
     * @param Board $board
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Team $team, Project $project, Board $board)
    {
        $this->authorize('update', [$project, $team]);
        
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $board->update([
            'name' => $request->name,
        ]);

        return response()->json($board);
    }

    /**
     * Remove the specified board.
     *
     * @param Team $team
     * @param Project $project
     * @param Board $board
     * @return \Illuminate\Http\Response
     */
    public function destroy(Team $team, Project $project, Board $board)
    {
        $this->authorize('update', [$project, $team]);
        
        $board->delete();

        return response()->noContent();
    }
}