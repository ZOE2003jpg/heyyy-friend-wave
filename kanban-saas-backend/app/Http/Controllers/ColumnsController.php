<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\Column;
use App\Models\Project;
use App\Models\Team;
use Illuminate\Http\Request;

class ColumnsController extends Controller
{
    /**
     * Store a newly created column.
     *
     * @param Request $request
     * @param Team $team
     * @param Project $project
     * @param Board $board
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request, Team $team, Project $project, Board $board)
    {
        $this->authorize('update', [$project, $team]);
        
        $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'nullable|integer',
        ]);

        // If position is not provided, add to the end
        if (!$request->has('position')) {
            $position = $board->columns()->max('position') + 1;
        } else {
            $position = $request->position;
            // Reorder existing columns
            $board->columns()
                ->where('position', '>=', $position)
                ->increment('position');
        }

        $column = $board->columns()->create([
            'name' => $request->name,
            'position' => $position,
        ]);

        return response()->json($column, 201);
    }

    /**
     * Update the specified column.
     *
     * @param Request $request
     * @param Team $team
     * @param Project $project
     * @param Board $board
     * @param Column $column
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Team $team, Project $project, Board $board, Column $column)
    {
        $this->authorize('update', [$project, $team]);
        
        $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'nullable|integer',
        ]);

        // Handle position change if provided
        if ($request->has('position') && $request->position != $column->position) {
            $oldPosition = $column->position;
            $newPosition = $request->position;
            
            if ($oldPosition < $newPosition) {
                // Moving right, decrement positions of columns in between
                $board->columns()
                    ->where('position', '>', $oldPosition)
                    ->where('position', '<=', $newPosition)
                    ->decrement('position');
            } else {
                // Moving left, increment positions of columns in between
                $board->columns()
                    ->where('position', '<', $oldPosition)
                    ->where('position', '>=', $newPosition)
                    ->increment('position');
            }
            
            $column->position = $newPosition;
        }

        $column->name = $request->name;
        $column->save();

        return response()->json($column);
    }

    /**
     * Remove the specified column.
     *
     * @param Team $team
     * @param Project $project
     * @param Board $board
     * @param Column $column
     * @return \Illuminate\Http\Response
     */
    public function destroy(Team $team, Project $project, Board $board, Column $column)
    {
        $this->authorize('update', [$project, $team]);
        
        // Reorder remaining columns
        $board->columns()
            ->where('position', '>', $column->position)
            ->decrement('position');
            
        $column->delete();

        return response()->noContent();
    }
}