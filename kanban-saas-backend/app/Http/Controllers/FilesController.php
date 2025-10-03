<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\Card;
use App\Models\Project;
use App\Models\Team;
use App\Services\FileStorageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FilesController extends Controller
{
    protected $fileStorageService;

    public function __construct(FileStorageService $fileStorageService)
    {
        $this->fileStorageService = $fileStorageService;
    }

    /**
     * Upload a file attachment to a card.
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
            'file' => 'required|file|max:10240', // 10MB max
        ]);

        $file = $request->file('file');
        $path = $this->fileStorageService->storeFile($file, "teams/{$team->id}/projects/{$project->id}/cards/{$card->id}");
        
        $attachment = $card->attachments()->create([
            'filename' => $file->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'user_id' => Auth::id(),
        ]);

        return response()->json($attachment, 201);
    }

    /**
     * Download a file attachment.
     *
     * @param Team $team
     * @param Project $project
     * @param Board $board
     * @param Card $card
     * @param int $attachmentId
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    public function download(Team $team, Project $project, Board $board, Card $card, $attachmentId)
    {
        $this->authorize('view', [$project, $team]);
        
        $attachment = $card->attachments()->findOrFail($attachmentId);
        
        return $this->fileStorageService->downloadFile($attachment->path, $attachment->filename);
    }

    /**
     * Remove a file attachment.
     *
     * @param Team $team
     * @param Project $project
     * @param Board $board
     * @param Card $card
     * @param int $attachmentId
     * @return \Illuminate\Http\Response
     */
    public function destroy(Team $team, Project $project, Board $board, Card $card, $attachmentId)
    {
        $this->authorize('update', [$project, $team]);
        
        $attachment = $card->attachments()->findOrFail($attachmentId);
        
        // Only the uploader or project admin can delete it
        if ($attachment->user_id !== Auth::id() && !$team->hasRole(Auth::id(), 'admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $this->fileStorageService->deleteFile($attachment->path);
        $attachment->delete();

        return response()->noContent();
    }
}