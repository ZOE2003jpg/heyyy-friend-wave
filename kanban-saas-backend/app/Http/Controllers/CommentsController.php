<?php

namespace App\Http\Controllers;

use App\Events\CommentAdded;
use App\Models\Board;
use App\Models\Card;
use App\Models\Comment;
use App\Models\Project;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentsController extends Controller
{
    /**
     * Store a newly created comment.
     *
     * @param Request $request
     * @param Team $team
     * @param Project $project
     * @param Board $board
     * @param Card $card
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request, Team $team, Project $project, Board $board, Card $card)
    {
        $this->authorize('update', [$project, $team]);
        
        $request->validate([
            'content' => 'required|string',
        ]);

        $comment = $card->comments()->create([
            'content' => $request->content,
            'user_id' => Auth::id(),
        ]);

        // Load the user relationship
        $comment->load('user');

        // Broadcast the comment added event
        broadcast(new CommentAdded($comment, $card, $board))->toOthers();

        return response()->json($comment, 201);
    }

    /**
     * Update the specified comment.
     *
     * @param Request $request
     * @param Team $team
     * @param Project $project
     * @param Board $board
     * @param Card $card
     * @param Comment $comment
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Team $team, Project $project, Board $board, Card $card, Comment $comment)
    {
        $this->authorize('update', [$project, $team]);
        
        // Only the comment author can update it
        if ($comment->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $request->validate([
            'content' => 'required|string',
        ]);

        $comment->update([
            'content' => $request->content,
        ]);

        return response()->json($comment);
    }

    /**
     * Remove the specified comment.
     *
     * @param Team $team
     * @param Project $project
     * @param Board $board
     * @param Card $card
     * @param Comment $comment
     * @return \Illuminate\Http\Response
     */
    public function destroy(Team $team, Project $project, Board $board, Card $card, Comment $comment)
    {
        $this->authorize('update', [$project, $team]);
        
        // Only the comment author or project admin can delete it
        if ($comment->user_id !== Auth::id() && !$team->hasRole(Auth::id(), 'admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $comment->delete();

        return response()->noContent();
    }
}